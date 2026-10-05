using System.ComponentModel.DataAnnotations;

namespace backend.Dtos;

public record RegisterRequest(
    [param: Required, StringLength(100, MinimumLength = 1)] string Name,
    [param: Required, EmailAddress, StringLength(254)] string Email,
    [param: Required, StringLength(72, MinimumLength = 8)] string Password);
public record LoginRequest(
    [param: Required, EmailAddress, StringLength(254)] string Email,
    [param: Required, StringLength(72)] string Password);
public record ForgotPasswordRequest([param: Required, EmailAddress, StringLength(254)] string Email);
public record ResetPasswordRequest(
    [param: Required, StringLength(128)] string Token,
    [param: Required, StringLength(72, MinimumLength = 8)] string Password);

public record UserDto(int Id, string Name, string Email, string Role, bool IsEmailVerified);
public record AuthResponse(string Token, UserDto User);
