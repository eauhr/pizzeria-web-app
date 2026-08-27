namespace backend.Dtos;

public record RegisterRequest(string Name, string Email, string Password);
public record LoginRequest(string Email, string Password);
public record VerifyOtpRequest(string Email, string Otp);
public record ResendOtpRequest(string Email);
public record ForgotPasswordRequest(string Email);
public record ResetPasswordRequest(string Token, string Password);

public record UserDto(int Id, string Name, string Email, string Role, bool IsEmailVerified);
public record AuthResponse(string Token, UserDto User);