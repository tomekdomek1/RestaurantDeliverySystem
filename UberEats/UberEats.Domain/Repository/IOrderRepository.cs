using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UberEats.Domain.Entities;

namespace UberEats.Domain.Repository;

public interface IOrderRepository : IRepository<Order>
{
    Task<Order?> GetOrderWithDetailsAsync(Guid id);
}
