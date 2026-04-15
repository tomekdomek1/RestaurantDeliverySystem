using MediatR;
using UberEats.Domain.Entities;

namespace UberEats.Application.Restaurants.Dishes.AddDishToMenu;

public class AddDishToMenuCommand : IRequest<Dish>
{
    public string Name { get; }
    public string Description { get; }
    public decimal Price { get; }
    public Guid RestaurantId {  get; }
    public Guid CategoryId { get; }
    public AddDishToMenuCommand(string name, string description, decimal price, Guid restaurantId, Guid categoryId)
    {
        Name = name;
        Description = description;
        Price = price;
        RestaurantId = restaurantId;
        CategoryId = categoryId;
    }
}
