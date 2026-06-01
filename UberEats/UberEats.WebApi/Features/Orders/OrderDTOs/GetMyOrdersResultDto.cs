namespace UberEats.WebApi.Features.Orders.OrderDTOs;

public class GetMyOrdersResultDto
{
    public Guid Id { get; set; }
    public Guid RestaurantId { get; set; }
    public DateTime Date { get; set; }
    public TimeOnly DeliveryTime { get; set; }
    public string? Notes { get; set; }
    public string Status { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public OrderAddressResultDto Address { get; set; } = new();
    public List<OrderItemResultDto> Items { get; set; } = new();
}

public class OrderAddressResultDto
{
    public string Street { get; set; } = string.Empty;
    public int BuildingNumber { get; set; }
    public int AppartmentNumber { get; set; }
    public string City { get; set; } = string.Empty;
}
