using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UberEats.Domain.Common.Models;
using UberEats.Domain.Enums;

namespace UberEats.Domain.Entities;

public sealed class Order : Entity<Guid>
{
    // Fields
    public string Notes { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public TimeOnly DeliveryTime { get; set; }
    public OrderStatus OrderStatus { get; set; }
    public decimal TotalAmount { get; set; } // probably can't be passed in the constructor, don't know if possible
    // to automate the value, maybe just calculate in repo

    // References
    public Guid CustomerId { get; set; }
    public Customer Customer { get; set; } = null!;
    public Guid RestaurantId { get; set; }
    public Restaurant Restaurant { get; set; } = null!;
    public Guid DriverId { get; set; }
    public Driver Driver { get; set; } = null!;
    public OrderAddress OrderAddress { get; set; } = null!; // need to create a copy of an address during order creation in repo
    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    public Order(Guid id, string notes, DateTime date, TimeOnly deliveryTime, OrderStatus orderStatus,
        Guid customerId, Guid restaurantId, Guid driverId) : base(id)
    {
        Notes = notes;
        Date = date;
        DeliveryTime = deliveryTime;
        OrderStatus = orderStatus;
        CustomerId = customerId;
        RestaurantId = restaurantId;
        DriverId = driverId;
    }
}
