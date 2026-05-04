using System.ComponentModel.DataAnnotations.Schema;
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

    // Atrybut [NotMapped] mówi EF Core: "Ignoruj to pole przy generowaniu SQL"
    // Dzięki temu błąd "column o.CreatedAt does not exist" zniknie.
    [NotMapped]
    public DateTime CreatedAt { get; set; }
    
    public Guid CustomerId { get; set; }
    public Guid RestaurantId { get; set; }
    public Guid DriverId { get; set; }

    public Order(Guid id, string? notes, DateTime date, TimeOnly deliveryTime, OrderStatus orderStatus, 
                 Guid customerId, Guid restaurantId, Guid driverId) : base(id)
    {
        Notes = notes;
        Date = date;
        DeliveryTime = deliveryTime;
        OrderStatus = orderStatus;
        CustomerId = customerId;
        RestaurantId = restaurantId;
        DriverId = driverId;
        
        TotalAmount = 0; 
        CreatedAt = DateTime.UtcNow;
    }

    // Konstruktor dla EF Core
    private Order() : base(Guid.Empty) { }
}