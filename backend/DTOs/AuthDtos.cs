using System.ComponentModel.DataAnnotations;

namespace backend.Dtos;

public record RegisterRequest(
    [property: Required, StringLength(100, MinimumLength = 1)] string Name,
    [property: Required, EmailAddress, StringLength(254)] string Email,
    [property: Required, StringLength(72, MinimumLength = 12), RegularExpression("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z\\d]).{12,72}$", ErrorMessage = "Password must include lowercase, uppercase, number, and symbol characters.")] string Password);
public record LoginRequest(
    [property: Required, EmailAddress, StringLength(254)] string Email,
    [property: Required, StringLength(72)] string Password);
public record VerifyOtpRequest(
    [property: Required, EmailAddress, StringLength(254)] string Email,
    [property: Required, RegularExpression("^\\d{6}$")] string Otp);
public record ResendOtpRequest([property: Required, EmailAddress, StringLength(254)] string Email);
public record ForgotPasswordRequest([property: Required, EmailAddress, StringLength(254)] string Email);
public record ResetPasswordRequest(
    [property: Required, StringLength(128)] string Token,
    [property: Required, StringLength(72, MinimumLength = 12), RegularExpression("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z\\d]).{12,72}$", ErrorMessage = "Password must include lowercase, uppercase, number, and symbol characters.")] string Password);

public record UserDto(int Id, string Name, string Email, string Role, bool IsEmailVerified);
public record AuthResponse(string Token, UserDto User);
