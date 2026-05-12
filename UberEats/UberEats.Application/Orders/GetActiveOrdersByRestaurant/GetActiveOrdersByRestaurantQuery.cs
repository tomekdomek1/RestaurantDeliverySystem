using MediatR;
using UberEats.Domain.Entities;
using UberEats.Domain.Repository;

namespace UberEats.Application.Orders.GetActiveOrdersByRestaurant;

public sealed record GetActiveOrdersByRestaurantQuery(Guid RestaurantId) : IRequest<List<Order>>;

public sealed class GetActiveOrdersByRestaurantQueryHandler : IRequestHandler<GetActiveOrdersByRestaurantQuery, List<Order>>
{
    private readonly IOrderRepository _orderRepository;
    public GetActiveOrdersByRestaurantQueryHandler(IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository;
    }

    public async Task<List<Order>> Handle(GetActiveOrdersByRestaurantQuery request, CancellationToken cancellationToken)
    {
        return await _orderRepository.GetActiveForRestaurantAsync(request.RestaurantId);
    }
}
