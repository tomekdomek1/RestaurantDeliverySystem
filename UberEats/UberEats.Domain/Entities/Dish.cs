using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UberEats.Domain.Common.Models;

namespace UberEats.Domain.Entities;

public sealed class Dish : Entity<Guid>
{
    // Fields
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }

    // References
    public Guid RestaurantId { get; set; }
    public Restaurant Restaurant { get; set; } = null!;
    public Guid CategoryId { get; set; }
    public Category Category { get; set; } = null!;
    public Dish(Guid id, string name, string description, decimal price,
        Guid restaurantId, Guid categoryId) : base(id)
    {
        Name = name;
        Description = description;
        Price = price;
        RestaurantId = restaurantId;
        CategoryId = categoryId;
    }
}
