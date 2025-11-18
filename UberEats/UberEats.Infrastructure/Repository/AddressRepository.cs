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

public class AddressRepository : RepositoryBase<Address>, IAddressRepository
{
    public AddressRepository(AppDbContext context) : base(context) { }
    public async Task<bool> HasRestaurantsAsync()
    {
        return await _context.Restaurants.AnyAsync();
    }
}
