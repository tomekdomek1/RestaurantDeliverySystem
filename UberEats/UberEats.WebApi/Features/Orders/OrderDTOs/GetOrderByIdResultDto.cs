using UberEats.Domain.Enums;

namespace UberEats.WebApi.Features.Orders.OrderDTOs;

public class GetOrderByIdResultDto
{
    public Guid Id { get; set; }
    public string? Notes { get; set; }
    public DateTime Date { get; set; }
    public TimeOnly DeliveryTime { get; set; }
    public OrderStatus OrderStatus { get; set; }
    public decimal TotalAmount { get; set; }
    public Guid CustomerId { get; set; }
    public Guid RestaurantId { get; set; }
    public Guid DriverId { get; set; }
    
    public OrderAddressDto? Address { get; set; }
    public OrderDriverDto? Driver { get; set; }
    public List<OrderItemDto> Items { get; set; } = new();
}

public class OrderAddressDto
{
    public string Street { get; set; } = string.Empty;
    public int BuildingNumber { get; set; }
    public int AppartmentNumber { get; set; }
    public string City { get; set; } = string.Empty;
}

public class OrderDriverDto
{
    public string Name { get; set; } = string.Empty;
    public string Surname { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
}

public class OrderItemDto
{
    public Guid Id { get; set; }
    public string DishNameAtPurchase { get; set; } = string.Empty;
    public decimal PriceAtPurchase { get; set; }
    public int Quantity { get; set; }
    public Guid DishId { get; set; }
}
