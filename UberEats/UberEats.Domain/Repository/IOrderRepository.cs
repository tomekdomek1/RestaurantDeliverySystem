using UberEats.Domain.Entities;

namespace UberEats.Domain.Repository;

public interface IOrderRepository : IRepository<Order>
{
    Task<List<Order>> GetActiveForRestaurantAsync(Guid restaurantId);
    Task<List<Order>> GetForCustomerAsync(Guid customerId);
}
