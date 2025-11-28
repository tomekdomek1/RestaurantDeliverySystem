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

public class RestaurantRepository : RepositoryBase<Restaurant>, IRestaurantRepository
{
    public RestaurantRepository(AppDbContext context) : base(context) { }
    public async Task<Restaurant?> GetWithDishesAsync(Guid id)
    {
        return await _set
            .Include(r => r.Dishes)
            .FirstOrDefaultAsync(r => r.Id == id);
    }
    public async Task<bool> AnyAsync()
    {
        return await _set.AnyAsync();
    }
}