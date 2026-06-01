using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UberEats.Domain.Entities;
using UberEats.Domain.Repository;
using UberEats.Infrastructure.Databases;

namespace UberEats.Infrastructure.Repository;

public class OrderRepository : RepositoryBase<Order>, IOrderRepository
{
    public OrderRepository(AppDbContext context) : base(context)
    {
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
