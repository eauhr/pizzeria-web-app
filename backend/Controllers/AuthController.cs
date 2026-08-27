using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using backend.Data;
using backend.Dtos;
using backend.Models;
using backend.Services;

namespace backend.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly PizzeriaDbContext _db;
    private readonly IJwtService _jwt;
    private readonly IEmailService _email;
    private readonly IConfiguration _config;

    public AuthController(PizzeriaDbContext db, IJwtService jwt, IEmailService email, IConfiguration config)
    {
        _db = db; _jwt = jwt; _email = email; _config = config;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest req)
    {
        if (await _db.Users.AnyAsync(u => u.Email == req.Email))
            return BadRequest(new { message = "An account with this email already exists." });

        var otp = GenerateOtp();
        var user = new User
        {
            Name = req.Name,
            Email = req.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password),
            IsEmailVerified = false,
            OtpCode = otp,
            OtpExpiresAt = DateTime.UtcNow.AddMinutes(10),
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();
        await _email.SendOtpEmailAsync(user.Email, otp);

        return Ok(new { message = "Registered. Check your email for a verification code." });
    }

    [HttpPost("verify-otp")]
    public async Task<IActionResult> VerifyOtp(VerifyOtpRequest req)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == req.Email);
        if (user == null || user.OtpCode != req.Otp || user.OtpExpiresAt < DateTime.UtcNow)
            return BadRequest(new { message = "Invalid or expired code." });

        user.IsEmailVerified = true;
        user.OtpCode = null;
        user.OtpExpiresAt = null;
        await _db.SaveChangesAsync();

        return Ok(new AuthResponse(_jwt.GenerateToken(user), ToDto(user)));
    }

    [HttpPost("resend-otp")]
    public async Task<IActionResult> ResendOtp(ResendOtpRequest req)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == req.Email);
        if (user != null)
        {
            var otp = GenerateOtp();
            user.OtpCode = otp;
            user.OtpExpiresAt = DateTime.UtcNow.AddMinutes(10);
            await _db.SaveChangesAsync();
            await _email.SendOtpEmailAsync(user.Email, otp);
        }
        return Ok(new { message = "If that account exists, a new code was sent." });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest req)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == req.Email);
        if (user == null || !BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
            return Unauthorized(new { message = "Invalid email or password." });

        if (!user.IsEmailVerified)
            return Unauthorized(new { message = "Please verify your email before logging in." });

        return Ok(new AuthResponse(_jwt.GenerateToken(user), ToDto(user)));
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> Me()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var user = await _db.Users.FindAsync(userId);
        if (user == null) return NotFound();
        return Ok(new { user = ToDto(user) });
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword(ForgotPasswordRequest req)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == req.Email);
        if (user != null)
        {
            var token = Guid.NewGuid().ToString("N");
            user.PasswordResetToken = token;
            user.PasswordResetTokenExpiresAt = DateTime.UtcNow.AddMinutes(30);
            await _db.SaveChangesAsync();

            var frontendUrl = _config["Frontend:BaseUrl"] ?? "http://localhost:5173";
            await _email.SendPasswordResetEmailAsync(user.Email, $"{frontendUrl}/reset-password?token={token}");
        }
        return Ok(new { message = "If that account exists, a reset link was sent." });
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword(ResetPasswordRequest req)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.PasswordResetToken == req.Token);
        if (user == null || user.PasswordResetTokenExpiresAt < DateTime.UtcNow)
            return BadRequest(new { message = "Invalid or expired reset link." });

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password);
        user.PasswordResetToken = null;
        user.PasswordResetTokenExpiresAt = null;
        await _db.SaveChangesAsync();

        return Ok(new { message = "Password updated." });
    }

    private static string GenerateOtp() => Random.Shared.Next(100000, 999999).ToString();
    private static UserDto ToDto(User u) => new(u.Id, u.Name, u.Email, u.Role, u.IsEmailVerified);
}