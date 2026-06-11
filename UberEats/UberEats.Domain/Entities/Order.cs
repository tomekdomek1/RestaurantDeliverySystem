using System;
using System.Collections.Generic;
using UberEats.Domain.Common.Models;
using UberEats.Domain.Enums;

namespace UberEats.Domain.Entities;

public sealed class Order : Entity<Guid>
{
    public string? Notes { get; set; }
    public DateTime Date { get; set; }
    public TimeOnly DeliveryTime { get; set; }
    public OrderStatus OrderStatus { get; set; }
    public decimal TotalAmount { get; set; }

    public Guid CustomerId { get; set; }
    public Customer Customer { get; set; } = null!;

    public Guid RestaurantId { get; set; }
    public Restaurant Restaurant { get; set; } = null!;

    // ZMIANA: Nullable! Zamówienie na starcie nie ma kierowcy
    public Guid? DriverId { get; set; }
    public Driver? Driver { get; set; }

    public OrderAddress? OrderAddress { get; set; }

    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

    public Order(Guid id, string? notes, DateTime date, TimeOnly deliveryTime, OrderStatus orderStatus, Guid customerId, Guid restaurantId, Guid? driverId = null) 
        : base(id)
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