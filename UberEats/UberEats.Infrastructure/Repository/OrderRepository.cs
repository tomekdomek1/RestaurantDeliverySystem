using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
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

    public async Task<List<Order>> GetForCustomerAsync(Guid customerId)
    {
        return await _set
            .AsNoTracking()
            .Include(o => o.OrderItems)
            .Include(o => o.OrderAddress)
            .Where(o => o.CustomerId == customerId)
            .OrderByDescending(o => o.Date)
            .ToListAsync();
    }

    public async Task<Order?> GetOrderWithDetailsAsync(Guid id)
    {
        return await _set
            .Include(o => o.Address)
            .Include(o => o.Driver)
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.Id == id);
    }
}
