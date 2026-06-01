using MediatR;
using UberEats.Domain.Entities;
using UberEats.Domain.Repository;

namespace UberEats.Application.Orders.GetOrderById;

public sealed record GetOrderByIdQuery(Guid Id) : IRequest<Order>;

public sealed class GetOrderByIdQueryHandler : IRequestHandler<GetOrderByIdQuery, Order>
{
    private readonly IOrderRepository _orderRepository;

    public GetOrderByIdQueryHandler(IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository;
    }

    public async Task<Order> Handle(GetOrderByIdQuery request, CancellationToken cancellationToken)
    {
        var order = await _orderRepository.GetOrderWithDetailsAsync(request.Id);

        if (order == null)
        {
            throw new KeyNotFoundException($"Order with ID {request.Id} not found.");
        }

        return order;
    }
}
