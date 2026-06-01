using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UberEats.Domain.Entities;

namespace UberEats.Domain.Repository;

public interface IOrderRepository : IRepository<Order>
{
    Task<List<Order>> GetActiveForRestaurantAsync(Guid restaurantId);
    Task<List<Order>> GetForCustomerAsync(Guid customerId);
    Task<Order?> GetOrderWithDetailsAsync(Guid id);
}
