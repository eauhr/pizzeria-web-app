using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.RateLimiting;
using backend.Data;
using backend.Dtos;
using backend.Models;
using backend.Services;

namespace backend.Controllers;

[ApiController]
[Route("api/auth")]
[EnableRateLimiting("auth")]
public class AuthController : ControllerBase
{
    private readonly PizzeriaDbContext _db;
    private readonly IJwtService _jwt;
    private readonly IEmailService _email;
    private readonly IConfiguration _config;
    private readonly ILogger<AuthController> _logger;

    public AuthController(PizzeriaDbContext db, IJwtService jwt, IEmailService email, IConfiguration config, ILogger<AuthController> logger)
    {
        _db = db; _jwt = jwt; _email = email; _config = config; _logger = logger;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest req, CancellationToken cancellationToken)
    {
        var email = NormalizeEmail(req.Email);
        if (await _db.Users.AnyAsync(u => u.Email.ToLower() == email, cancellationToken))
            return Conflict(new { message = "An account with this email already exists. Please sign in or reset your password." });

        var user = new User
        {
            Name = req.Name,
            Email = email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password, workFactor: 12),
            IsEmailVerified = true,
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync(cancellationToken);

        return Ok(new AuthResponse(_jwt.GenerateToken(user), ToDto(user)));
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest req, CancellationToken cancellationToken)
    {
        var email = NormalizeEmail(req.Email);
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == email, cancellationToken);
        if (user == null || !BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
            return Unauthorized(new { message = "Invalid email or password." });

        if (!user.IsEmailVerified || user.OtpCode != null || user.OtpExpiresAt != null)
        {
            user.IsEmailVerified = true;
            user.OtpCode = null;
            user.OtpExpiresAt = null;
            await _db.SaveChangesAsync(cancellationToken);
        }

        return Ok(new AuthResponse(_jwt.GenerateToken(user), ToDto(user)));
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> Me(CancellationToken cancellationToken)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var user = await _db.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);
        if (user == null) return NotFound();
        return Ok(new { user = ToDto(user) });
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword(ForgotPasswordRequest req, CancellationToken cancellationToken)
    {
        var email = NormalizeEmail(req.Email);
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == email, cancellationToken);
        if (user != null)
        {
            var token = Convert.ToHexString(RandomNumberGenerator.GetBytes(32));
            user.PasswordResetToken = HashResetToken(token);
            user.PasswordResetTokenExpiresAt = DateTime.UtcNow.AddMinutes(30);
            await _db.SaveChangesAsync(cancellationToken);

            var frontendUrl = _config["Frontend:BaseUrl"] ?? "http://localhost:5173";
            try
            {
                await _email.SendPasswordResetEmailAsync(user.Email, $"{frontendUrl}/reset-password?token={token}", cancellationToken);
            }
            catch (Exception exception)
            {
                _logger.LogError(exception, "Password reset email delivery failed.");
            }
        }
        return Ok(new { message = "If that account exists, a reset link was sent." });
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword(ResetPasswordRequest req, CancellationToken cancellationToken)
    {
        var tokenHash = HashResetToken(req.Token);
        var user = await _db.Users.FirstOrDefaultAsync(u => u.PasswordResetToken == tokenHash, cancellationToken);
        if (user == null || user.PasswordResetTokenExpiresAt < DateTime.UtcNow)
            return BadRequest(new { message = "Invalid or expired reset link." });

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password, workFactor: 12);
        user.PasswordResetToken = null;
        user.PasswordResetTokenExpiresAt = null;
        await _db.SaveChangesAsync(cancellationToken);

        return Ok(new { message = "Password updated." });
    }

    private static string NormalizeEmail(string email) => email.Trim().ToLowerInvariant();
    private static string HashResetToken(string token) => Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(token)));
    private static UserDto ToDto(User u) => new(u.Id, u.Name, u.Email, u.Role, u.IsEmailVerified);
}
