using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UberEats.Domain.Entities;

namespace UberEats.Application.Restaurants.Dishes.EditDish;

// Testing to see if mapping works with record
// Does not - for now we make it a class - can later change mapping function - for now it would take too long to test everything

//public record EditDishCommand(Guid Id, Guid RestaurantId, string? Name, string? Description, decimal? Price, Guid? CategoryId) : IRequest<Dish>;

public class EditDishCommand : IRequest<Dish>
{
    public Guid Id { get; }
    public Guid RestaurantId { get; }
    public string? Name { get; }
    public string? Description { get; }
    public decimal? Price { get; }
    public Guid? CategoryId { get; }
    public EditDishCommand(Guid id, Guid restaurantId, string? name, string? description, decimal? price, Guid? categoryId)
    {
        Id = id;
        RestaurantId = restaurantId;
        Name = name;
        Description = description;
        Price = price;
        CategoryId = categoryId;
    }
}
