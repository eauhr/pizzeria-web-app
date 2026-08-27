using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace backend.Services;

public class EmailService : IEmailService
{
    private readonly IConfiguration _config;
    public EmailService(IConfiguration config) => _config = config;

    public Task SendOtpEmailAsync(string toEmail, string otpCode) =>
        SendAsync(toEmail, "Verify your Picanntino account",
            $"<p>Your verification code is:</p><h2 style='letter-spacing:4px'>{otpCode}</h2><p>It expires in 10 minutes.</p>");

    public Task SendPasswordResetEmailAsync(string toEmail, string resetLink) =>
        SendAsync(toEmail, "Reset your Picanntino password",
            $"<p>Click below to reset your password. This link expires in 30 minutes.</p><p><a href=\"{resetLink}\">Reset Password</a></p>");

    private async Task SendAsync(string toEmail, string subject, string htmlBody)
    {
        var message = new MimeMessage();
        message.From.Add(MailboxAddress.Parse(_config["Smtp:From"]));
        message.To.Add(MailboxAddress.Parse(toEmail));
        message.Subject = subject;
        message.Body = new TextPart("html") { Text = htmlBody };

        using var client = new SmtpClient();
        await client.ConnectAsync(_config["Smtp:Host"], int.Parse(_config["Smtp:Port"]!), SecureSocketOptions.StartTls);
        await client.AuthenticateAsync(_config["Smtp:User"], _config["Smtp:Password"]);
        await client.SendAsync(message);
        await client.DisconnectAsync(true);
    }
}