using System.ComponentModel.DataAnnotations;

namespace backend.Dtos;

public record CategoryDto(int Id, string Name);
public record ProductDto(int Id, string Name, string Description, decimal Price, string ImageUrl, bool IsAvailable, int CategoryId, string CategoryName);

public record SaveCategoryRequest(
    [param: Required, StringLength(80, MinimumLength = 1)] string Name);

public record SaveProductRequest(
    [param: Required, StringLength(120, MinimumLength = 1)] string Name,
    [param: Required, StringLength(1000, MinimumLength = 1)] string Description,
    [param: Range(typeof(decimal), "0.01", "10000")] decimal Price,
    [param: StringLength(2048)] string? ImageUrl,
    [param: Range(1, int.MaxValue)] int CategoryId,
    bool IsAvailable = true);
