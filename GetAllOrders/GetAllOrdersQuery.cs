using MediatR;

namespace UberEats.Application.Orders.GetAllOrders
{
    public class GetAllOrdersQuery : IRequest<IEnumerable<object>>
    {
    }
}