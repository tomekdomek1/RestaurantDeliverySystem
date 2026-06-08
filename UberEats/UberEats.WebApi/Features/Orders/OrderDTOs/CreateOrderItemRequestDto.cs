namespace UberEats.WebApi.Features.Orders.OrderDTOs;

public class CreateOrderItemRequestDto
{
    public Guid DishId { get; set; }
    public string DishNameAtPurchase { get; set; } = string.Empty;
    public decimal PriceAtPurchase { get; set; }
    public int Quantity { get; set; }
}
