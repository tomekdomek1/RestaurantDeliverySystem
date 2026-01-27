namespace UberEats.WebApi.Features.Dishes.DishDTOs;

public class EditDishRequestDto
{
    public string? Name { get; set; } = string.Empty;
    public string? Description { get; set; } = string.Empty;
    public decimal? Price { get; set; }
    public Guid? CategoryId { get; set; }
}
