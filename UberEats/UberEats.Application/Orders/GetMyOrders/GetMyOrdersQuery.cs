using MediatR;
using UberEats.Domain.Entities;
using UberEats.Domain.Interfaces;
using UberEats.Domain.Repository;

namespace UberEats.Application.Orders.GetMyOrders;

public sealed record GetMyOrdersQuery() : IRequest<List<Order>>;

public sealed class GetMyOrdersQueryHandler : IRequestHandler<GetMyOrdersQuery, List<Order>>
{
    private readonly IOrderRepository _orderRepository;
    private readonly ICurrentUserContext _currentUserContext;

    public GetMyOrdersQueryHandler(IOrderRepository orderRepository, ICurrentUserContext currentUserContext)
    {
        _orderRepository = orderRepository;
        _currentUserContext = currentUserContext;
    }

    public async Task<List<Order>> Handle(GetMyOrdersQuery request, CancellationToken cancellationToken)
    {
        if (!_currentUserContext.IsAuthenticated || string.IsNullOrWhiteSpace(_currentUserContext.UserId))
        {
            throw new UnauthorizedAccessException("User is not authenticated.");
        }

        if (!Guid.TryParse(_currentUserContext.UserId, out var customerId))
        {
            throw new UnauthorizedAccessException("User identifier is invalid.");
        }

        return await _orderRepository.GetForCustomerAsync(customerId);
    }
}
