using UberEats.Application.Orders.CreateOrder;

namespace UberEats.WebApi.Features.Orders.OrderDTOs;

public class CreateOrderRequestDto
{
  
    
    public Guid RestaurantId { get; set; }
    public AddressDto Address { get; set; } = null!;
    public string? Notes { get; set; }
    public TimeOnly DeliveryTime { get; set; }
    public List<CreateOrderItemRequestDto> Items { get; set; } = new();
}