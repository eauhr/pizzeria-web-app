using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace backend.Services;

public interface IEmailService
{
    Task SendPasswordResetEmailAsync(string toEmail, string resetLink, CancellationToken cancellationToken = default);
}
