using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Dtos;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("api/categories")]
public class CategoriesController : ControllerBase
{
    private readonly PizzeriaDbContext _db;
    public CategoriesController(PizzeriaDbContext db) 
    { 
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var categories = await _db.Categories.AsNoTracking()
            .OrderBy(c => c.Name)
            .Select(c => new CategoryDto(c.Id, c.Name))
            .ToListAsync(cancellationToken);
        return Ok(categories);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
    {
        var category = await _db.Categories.AsNoTracking()
            .Where(c => c.Id == id)
            .Select(c => new CategoryDto(c.Id, c.Name))
            .FirstOrDefaultAsync(cancellationToken);
        return category == null ? NotFound() : Ok(category);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create(SaveCategoryRequest request, CancellationToken cancellationToken)
    {
        var name = request.Name.Trim();
        if (await _db.Categories.AnyAsync(c => c.Name.ToLower() == name.ToLower(), cancellationToken))
            return Conflict(new { message = "A category with this name already exists." });

        var category = new Category { Name = name };
        _db.Categories.Add(category);
        await _db.SaveChangesAsync(cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = category.Id }, new CategoryDto(category.Id, category.Name));
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, SaveCategoryRequest request, CancellationToken cancellationToken)
    {
        var category = await _db.Categories.FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
        if (category == null) return NotFound();

        var name = request.Name.Trim();
        if (await _db.Categories.AnyAsync(c => c.Id != id && c.Name.ToLower() == name.ToLower(), cancellationToken))
            return Conflict(new { message = "A category with this name already exists." });

        category.Name = name;
        await _db.SaveChangesAsync(cancellationToken);
        return Ok(new CategoryDto(category.Id, category.Name));
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var category = await _db.Categories.FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
        if (category == null) return NotFound();

        if (await _db.Products.AnyAsync(p => p.CategoryId == id, cancellationToken))
            return Conflict(new { message = "Move or remove the category's products before deleting it." });

        _db.Categories.Remove(category);
        await _db.SaveChangesAsync(cancellationToken);
        return NoContent();
    }
}
