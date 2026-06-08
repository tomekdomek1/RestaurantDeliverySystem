namespace UberEats.WebApi.Features.Orders.OrderDTOs;

public class CreateOrderResponseDto
{
    public Guid Id { get; set; }
    public DateTime Date { get; set; }
    public string Status { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public List<OrderItemResultDto> Items { get; set; } = new();
}
