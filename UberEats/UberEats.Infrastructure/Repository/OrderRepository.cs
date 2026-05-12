using Microsoft.EntityFrameworkCore;
using UberEats.Domain.Entities;
using UberEats.Domain.Enums;
using UberEats.Domain.Repository;
using UberEats.Infrastructure.Databases;

namespace UberEats.Infrastructure.Repository;

public class OrderRepository : RepositoryBase<Order>, IOrderRepository
{
    public OrderRepository(AppDbContext context) : base(context) { }

    public async Task<List<Order>> GetActiveForRestaurantAsync(Guid restaurantId)
    {
        return await _set
            .AsNoTracking()
            .Include(o => o.OrderItems)
            .Include(o => o.OrderAddress)
            .Where(o => o.RestaurantId == restaurantId && o.OrderStatus != OrderStatus.Delivered)
            .ToListAsync();
    }
}
