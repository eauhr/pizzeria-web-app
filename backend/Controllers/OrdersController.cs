using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using backend.Data;
using backend.Dtos;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("api/orders")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly PizzeriaDbContext _db;
    public OrdersController(PizzeriaDbContext db) => _db = db;

    private int CurrentUserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpPost]
    public async Task<IActionResult> Create(CreateOrderRequest req, CancellationToken cancellationToken)
    {
        if (req.Items == null || req.Items.Count == 0)
            return BadRequest(new { message = "Cart is empty." });

        var productIds = req.Items.Select(i => i.ProductId).Distinct().ToList();
        var products = await _db.Products.AsNoTracking().Where(p => productIds.Contains(p.Id) && p.IsAvailable).ToListAsync(cancellationToken);

        if (products.Count != productIds.Count)
            return BadRequest(new { message = "One or more items are no longer available." });

        var order = new Order { UserId = CurrentUserId, Status = "Pending", CreatedAt = DateTime.UtcNow };
        decimal total = 0;

        foreach (var item in req.Items)
        {
            var product = products.First(p => p.Id == item.ProductId);
            var qty = Math.Max(1, item.Quantity);
            total += product.Price * qty;
            order.OrderItems.Add(new OrderItem { ProductId = product.Id, Quantity = qty, Price = product.Price });
        }
        order.TotalPrice = total;

        _db.Orders.Add(order);
        await _db.SaveChangesAsync(cancellationToken);

        return Ok(ToDto(order, products));
    }

    [HttpGet("mine")]
    public async Task<IActionResult> GetMine(CancellationToken cancellationToken)
    {
        var orders = await _db.Orders.AsNoTracking()
            .Include(o => o.OrderItems).ThenInclude(oi => oi.Product)
            .Where(o => o.UserId == CurrentUserId)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync(cancellationToken);

        return Ok(orders.Select(o => ToDto(o, null)));
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var orders = await _db.Orders.AsNoTracking()
            .Include(o => o.OrderItems).ThenInclude(oi => oi.Product)
            .Include(o => o.User)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync(cancellationToken);

        return Ok(orders.Select(o => ToDto(o, null)));
    }

    [HttpPatch("{id}/status")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateStatus(int id, UpdateOrderStatusRequest req, CancellationToken cancellationToken)
    {
        var order = await _db.Orders.FirstOrDefaultAsync(o => o.Id == id, cancellationToken);
        if (order == null) return NotFound();

        order.Status = req.Status;
        await _db.SaveChangesAsync(cancellationToken);
        return Ok(new { message = "Status updated." });
    }

    private static OrderDto ToDto(Order o, List<Product>? hint) => new(
        o.Id, o.UserId, o.User?.Name, o.TotalPrice, o.Status, o.CreatedAt,
        o.OrderItems.Select(oi => new OrderItemDto(
            oi.ProductId,
            oi.Product?.Name ?? hint?.FirstOrDefault(p => p.Id == oi.ProductId)?.Name ?? "Item",
            oi.Quantity, oi.Price
        )).ToList()
    );
}
