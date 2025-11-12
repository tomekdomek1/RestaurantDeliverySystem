using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UberEats.Domain.Common.Models;

namespace UberEats.Domain.Entities;

public sealed class OrderItem : Entity<Guid>
{
    // Fields
    public string DishNameAtPurchase { get; private set; } = string.Empty;
    public decimal PriceAtPurchase { get; private set; }
    public int Quantity { get; private set; }

    // References
    public Guid OrderId { get; private set; }
    public Order Order { get; private set; } = null!;
    public Guid DishId { get; private set; }
    public Dish Dish { get; private set; } = null!;
    public OrderItem(Guid id, string dishNameAtPurchase,  decimal priceAtPurchase, int quantity,
        Guid orderId, Guid dishId) : base(id)
    {
        DishNameAtPurchase = dishNameAtPurchase;
        PriceAtPurchase = priceAtPurchase;
        Quantity = quantity;
        OrderId = orderId;
        DishId = dishId;
    }
}
