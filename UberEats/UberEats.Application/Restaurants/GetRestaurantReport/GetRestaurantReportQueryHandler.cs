using MediatR;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using UberEats.Domain.Repository;

namespace UberEats.Application.Restaurants.GetRestaurantReport
{
    public class GetRestaurantReportQueryHandler : IRequestHandler<GetRestaurantReportQuery, RestaurantReportResultDto>
    {
        private readonly IOrderRepository _orderRepository;

        public GetRestaurantReportQueryHandler(IOrderRepository orderRepository)
        {
            _orderRepository = orderRepository;
        }

        public async Task<RestaurantReportResultDto> Handle(GetRestaurantReportQuery request, CancellationToken cancellationToken)
        {
            var allOrders = await _orderRepository.GetAllAsync();
            
            var ordersInPeriod = allOrders
                .Where(o => o.RestaurantId == request.RestaurantId)
                .Where(o => o.Date >= request.StartDate && o.Date <= request.EndDate)
                .ToList();

            var totalOrders = ordersInPeriod.Count;
            var totalRevenue = ordersInPeriod.Sum(o => o.TotalAmount);
            var newCustomers = ordersInPeriod.Select(o => o.CustomerId).Distinct().Count();

            return new RestaurantReportResultDto
            {
                TotalOrders = totalOrders,
                TotalRevenue = totalRevenue,
                NewCustomers = newCustomers
            };
        }
    }
}