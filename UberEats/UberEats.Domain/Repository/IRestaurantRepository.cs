using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UberEats.Domain.Entities;

namespace UberEats.Domain.Repository;

// TODO: Create an inheritance structure for Repositories

public interface IRestaurantRepository : IRepository<Restaurant>
{
    Task<Restaurant?> GetWithDishesAsync(Guid id);
    Task<bool> AnyAsync();
}
