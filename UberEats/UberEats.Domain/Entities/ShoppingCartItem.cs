using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UberEats.Domain.Common.Models;

namespace UberEats.Domain.Entities;

/// <summary>
/// 
/// (!) When inheriting from the Entity class for our Id we run into a following issue:
/// A customer can add the same product into the shopping cart two times and instead of the Quantity increasing
/// it will result in a seperate record regarding the same dish this could be simply resolved by
/// having a primary key consisting of both CustomerId and DishId and increasing Quantity on an attempt to add
/// a Dish already existing in the ShoppingCartItems list.
/// 
/// Instead we need to manually search the list for an existing Dish matching the Id of the one trying to get in, in repo.
/// 
/// </summary>
/// 

public sealed class ShoppingCartItem : Entity<Guid>
{
    // Fields
    public int Quantity { get; private set; }
    public DateTime AddedAt { get; private set; }

    // References
    public Guid CustomerId { get; private set; }
    public Customer Customer { get; private set; } = null!;
    public Guid DishId { get; private set; }
    public Dish Dish { get; private set; } = null!;
    public ShoppingCartItem(Guid id, int quantity, DateTime addedAt,
        Guid customerId, Guid dishId) : base(id)
    {
        Quantity = quantity;
        AddedAt = addedAt;
        CustomerId = customerId;
        DishId = dishId;
    }
}
