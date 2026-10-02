using backend.Controllers;
using backend.Data;
using backend.Dtos;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging.Abstractions;
using Xunit;

namespace backend.Tests;

public sealed class AuthControllerTests
{
    [Fact]
    public async Task RegisterNormalizesEmailAndVerifyOtpConsumesHashedCode()
    {
        var (controller, db, mail) = CreateController();
        await controller.Register(new RegisterRequest("Test Guest", " Guest@Example.com ", "SecurePass1!"), CancellationToken.None);

        var user = await db.Users.SingleAsync();
        Assert.Equal("guest@example.com", user.Email);
        Assert.NotNull(mail.OtpCode);
        Assert.NotEqual(mail.OtpCode, user.OtpCode);

        var result = await controller.VerifyOtp(new VerifyOtpRequest("GUEST@example.com", mail.OtpCode!), CancellationToken.None);

        Assert.IsType<OkObjectResult>(result);
        Assert.True(user.IsEmailVerified);
        Assert.Null(user.OtpCode);
    }

    [Fact]
    public async Task ForgotPasswordStoresOnlyHashAndResetConsumesToken()
    {
        var (controller, db, mail) = CreateController();
        var user = new User
        {
            Name = "Test Guest",
            Email = "guest@example.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("OldSecure1!"),
            IsEmailVerified = true,
        };
        db.Users.Add(user);
        await db.SaveChangesAsync();

        await controller.ForgotPassword(new ForgotPasswordRequest(" GUEST@example.com "), CancellationToken.None);

        var rawToken = mail.ResetLink!.Split("token=", StringSplitOptions.None)[1];
        Assert.NotEqual(rawToken, user.PasswordResetToken);
        var result = await controller.ResetPassword(new ResetPasswordRequest(rawToken, "NewSecure2!"), CancellationToken.None);

        Assert.IsType<OkObjectResult>(result);
        Assert.True(BCrypt.Net.BCrypt.Verify("NewSecure2!", user.PasswordHash));
        Assert.Null(user.PasswordResetToken);
    }

    [Fact]
    public async Task LoginAcceptsNormalizedEmailAfterVerification()
    {
        var (controller, db, _) = CreateController();
        db.Users.Add(new User
        {
            Name = "Test Guest",
            Email = "guest@example.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("SecurePass1!"),
            IsEmailVerified = true,
        });
        await db.SaveChangesAsync();

        var result = await controller.Login(new LoginRequest(" GUEST@example.com ", "SecurePass1!"), CancellationToken.None);

        Assert.IsType<OkObjectResult>(result);
    }

    private static (AuthController Controller, PizzeriaDbContext Db, FakeEmailService Mail) CreateController()
    {
        var options = new DbContextOptionsBuilder<PizzeriaDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        var db = new PizzeriaDbContext(options);
        var mail = new FakeEmailService();
        var configuration = new ConfigurationBuilder().AddInMemoryCollection(new Dictionary<string, string?>
        {
            ["Jwt:Key"] = "this-is-a-long-enough-test-key-for-hmac",
            ["Frontend:BaseUrl"] = "https://example.test",
        }).Build();
        var controller = new AuthController(db, new FakeJwtService(), mail, configuration, NullLogger<AuthController>.Instance);
        controller.ControllerContext = new ControllerContext { HttpContext = new DefaultHttpContext() };
        return (controller, db, mail);
    }

    private sealed class FakeJwtService : IJwtService
    {
        public string GenerateToken(User user) => "test-token";
    }

    private sealed class FakeEmailService : IEmailService
    {
        public string? OtpCode { get; private set; }
        public string? ResetLink { get; private set; }

        public Task SendOtpEmailAsync(string toEmail, string otpCode, CancellationToken cancellationToken = default)
        {
            OtpCode = otpCode;
            return Task.CompletedTask;
        }

        public Task SendPasswordResetEmailAsync(string toEmail, string resetLink, CancellationToken cancellationToken = default)
        {
            ResetLink = resetLink;
            return Task.CompletedTask;
        }
    }
}
