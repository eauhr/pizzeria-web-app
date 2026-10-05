using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace backend.Services;

public class EmailService : IEmailService
{
    private readonly IConfiguration _config;
    public EmailService(IConfiguration config) => _config = config;

    public Task SendPasswordResetEmailAsync(string toEmail, string resetLink, CancellationToken cancellationToken = default) =>
        SendAsync(toEmail, "Reset your Picantino password",
            $"<p>Click below to reset your password. This link expires in 30 minutes.</p><p><a href=\"{resetLink}\">Reset Password</a></p>", cancellationToken);

    private async Task SendAsync(string toEmail, string subject, string htmlBody, CancellationToken cancellationToken)
    {
        string Required(string key) => _config[key] is { Length: > 0 } value
            ? value
            : throw new InvalidOperationException($"Missing SMTP configuration: {key}.");

        var message = new MimeMessage();
        message.From.Add(MailboxAddress.Parse(Required("Smtp:From")));
        message.To.Add(MailboxAddress.Parse(toEmail));
        message.Subject = subject;
        message.Body = new TextPart("html") { Text = htmlBody };

        using var client = new SmtpClient();
        client.Timeout = 10000;
        await client.ConnectAsync(Required("Smtp:Host"), int.Parse(_config["Smtp:Port"] ?? "587"), SecureSocketOptions.StartTls, cancellationToken);
        await client.AuthenticateAsync(Required("Smtp:User"), Required("Smtp:Password"), cancellationToken);
        await client.SendAsync(message, cancellationToken);
        await client.DisconnectAsync(true, cancellationToken);
    }
}
