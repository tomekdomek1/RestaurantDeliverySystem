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
    public string Name { get; private set; } = string.Empty;
    public string Description { get; private set; } = string.Empty;
    public decimal Price { get; private set; }

    // References
    public Guid RestaurantId { get; private set; }
    public Restaurant Restaurant { get; private set; } = null!;
    public Dish(Guid id, string name, string description, decimal price,
        Guid restaurantId) : base(id)
    {
        Name = name;
        Description = description;
        Price = price;
        RestaurantId = restaurantId;
    }
}
