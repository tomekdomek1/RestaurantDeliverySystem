namespace UberEats.WebApi.Features.Orders.OrderDTOs;

public class UpdateOrderStatusResponseDto
{
    public Guid Id { get; set; }
    public string Status { get; set; } = string.Empty;
}
