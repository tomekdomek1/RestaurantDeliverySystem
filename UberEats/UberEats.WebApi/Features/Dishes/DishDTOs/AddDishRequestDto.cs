namespace UberEats.WebApi.Features.Dishes.DishDTOs;

public class AddDishRequestDto
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public Guid CategoryId { get; set; }
}
