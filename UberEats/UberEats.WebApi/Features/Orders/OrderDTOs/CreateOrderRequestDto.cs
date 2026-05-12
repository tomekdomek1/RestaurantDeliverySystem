namespace UberEats.WebApi.Features.Orders.OrderDTOs;

public class CreateOrderRequestDto
{
    public Guid CustomerId { get; set; }
    public Guid RestaurantId { get; set; }
    public Guid DriverId { get; set; }
    public Guid AddressId { get; set; }
    public string? Notes { get; set; }
    public TimeOnly DeliveryTime { get; set; }
    public List<CreateOrderItemRequestDto> Items { get; set; } = new();
}
