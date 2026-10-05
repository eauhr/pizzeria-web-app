using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Dtos;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("api/products")]
public class ProductsController : ControllerBase
{
    private readonly PizzeriaDbContext _db;
    public ProductsController(PizzeriaDbContext db)
    {
        _db = db;
    } 

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int? categoryId, [FromQuery] bool includeUnavailable, CancellationToken cancellationToken)
    {
        if (includeUnavailable && !User.IsInRole("Admin")) return Forbid();

        var query = _db.Products.AsNoTracking().Include(p => p.Category).AsQueryable();
        if (!includeUnavailable) query = query.Where(p => p.IsAvailable);
        if (categoryId.HasValue) query = query.Where(p => p.CategoryId == categoryId);

        List<ProductDto> products = await query
            .OrderBy(p => p.Category!.Name).ThenBy(p => p.Name)
            .Select(p => new ProductDto(p.Id, p.Name, p.Description, p.Price, p.ImageUrl, p.IsAvailable, p.CategoryId, p.Category!.Name))
            .ToListAsync(cancellationToken);

        return Ok(products);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
    {
        var isAdmin = User.IsInRole("Admin");
        var p = await _db.Products.AsNoTracking().Include(x => x.Category)
            .FirstOrDefaultAsync(x => x.Id == id && (x.IsAvailable || isAdmin), cancellationToken);
        if (p == null) return NotFound();
        return Ok(new ProductDto(p.Id, p.Name, p.Description, p.Price, p.ImageUrl, p.IsAvailable, p.CategoryId, p.Category!.Name));
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create(SaveProductRequest request, CancellationToken cancellationToken)
    {
        if (!await _db.Categories.AnyAsync(c => c.Id == request.CategoryId, cancellationToken))
            return BadRequest(new { message = "Select an existing category." });

        var product = new Product
        {
            Name = request.Name.Trim(),
            Description = request.Description.Trim(),
            Price = request.Price,
            ImageUrl = request.ImageUrl?.Trim() ?? string.Empty,
            CategoryId = request.CategoryId,
            IsAvailable = request.IsAvailable,
        };
        _db.Products.Add(product);
        await _db.SaveChangesAsync(cancellationToken);

        await _db.Entry(product).Reference(p => p.Category).LoadAsync(cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = product.Id }, ToDto(product));
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, SaveProductRequest request, CancellationToken cancellationToken)
    {
        var product = await _db.Products.FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
        if (product == null) return NotFound();
        if (!await _db.Categories.AnyAsync(c => c.Id == request.CategoryId, cancellationToken))
            return BadRequest(new { message = "Select an existing category." });

        product.Name = request.Name.Trim();
        product.Description = request.Description.Trim();
        product.Price = request.Price;
        product.ImageUrl = request.ImageUrl?.Trim() ?? string.Empty;
        product.CategoryId = request.CategoryId;
        product.IsAvailable = request.IsAvailable;
        await _db.SaveChangesAsync(cancellationToken);
        await _db.Entry(product).Reference(p => p.Category).LoadAsync(cancellationToken);
        return Ok(ToDto(product));
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var product = await _db.Products.FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
        if (product == null) return NotFound();

        // Keep historical order items intact; hiding a product is safer than deleting it.
        product.IsAvailable = false;
        await _db.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    private static ProductDto ToDto(Product product) => new(
        product.Id,
        product.Name,
        product.Description,
        product.Price,
        product.ImageUrl,
        product.IsAvailable,
        product.CategoryId,
        product.Category?.Name ?? string.Empty);
}
