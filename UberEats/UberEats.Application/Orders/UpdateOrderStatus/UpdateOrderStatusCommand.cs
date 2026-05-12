using MediatR;
using UberEats.Domain.Entities;
using UberEats.Domain.Enums;
using UberEats.Domain.Repository;

namespace UberEats.Application.Orders.UpdateOrderStatus;

public sealed record UpdateOrderStatusCommand(Guid OrderId, OrderStatus Status) : IRequest<Order?>;

public sealed class UpdateOrderStatusCommandHandler : IRequestHandler<UpdateOrderStatusCommand, Order?>
{
    private readonly IOrderRepository _orderRepository;
    public UpdateOrderStatusCommandHandler(IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository;
    }

    public async Task<Order?> Handle(UpdateOrderStatusCommand request, CancellationToken cancellationToken)
    {
        var orderToUpdate = await _orderRepository.GetByIdAsync(request.OrderId);

        if (orderToUpdate == null)
        {
            return null;
        }

        orderToUpdate.OrderStatus = request.Status;

        await _orderRepository.SaveChangesAsync();

        return orderToUpdate;
    }
}
