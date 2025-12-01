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
    public string DishNameAtPurchase { get; set; } = string.Empty;
    public decimal PriceAtPurchase { get; set; }
    public int Quantity { get; set; }

    // References
    public Guid OrderId { get; set; }
    public Order Order { get; set; } = null!;
    public Guid DishId { get; set; }
    public Dish Dish { get; set; } = null!;
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
