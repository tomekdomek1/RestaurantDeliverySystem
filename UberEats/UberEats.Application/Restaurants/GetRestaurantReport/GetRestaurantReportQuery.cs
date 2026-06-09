using MediatR;
using System;

namespace UberEats.Application.Restaurants.GetRestaurantReport
{
    public class RestaurantReportResultDto
    {
        public int TotalOrders { get; set; }
        public decimal TotalRevenue { get; set; }
        public int NewCustomers { get; set; }
    }

    public class GetRestaurantReportQuery : IRequest<RestaurantReportResultDto>
    {
        public Guid RestaurantId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}