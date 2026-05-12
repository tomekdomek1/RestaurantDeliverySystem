using UberEats.Domain.Enums;

namespace UberEats.WebApi.Features.Orders.OrderDTOs;

public class UpdateOrderStatusRequestDto
{
    public OrderStatus Status { get; set; }
}
