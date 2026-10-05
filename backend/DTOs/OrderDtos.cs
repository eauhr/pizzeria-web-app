using System.ComponentModel.DataAnnotations;

namespace backend.Dtos;

public record CreateOrderItemRequest(
    [param: Range(1, int.MaxValue)] int ProductId,
    [param: Range(1, 20)] int Quantity);
public record CreateOrderRequest([param: Required, MinLength(1), MaxLength(50)] List<CreateOrderItemRequest> Items);

public record OrderItemDto(int ProductId, string ProductName, int Quantity, decimal Price);
public record OrderDto(int Id, int UserId, string? UserName, decimal TotalPrice, string Status, DateTime CreatedAt, List<OrderItemDto> Items);

public record UpdateOrderStatusRequest(
    [param: Required, RegularExpression("^(Pending|Preparing|Ready|Completed|Cancelled)$", ErrorMessage = "The order status is not supported.")] string Status);
