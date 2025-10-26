using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UberEats.Domain.Entities;
using UberEats.Domain.IRepository;
using UberEats.Infrastructure.Databases;

namespace UberEats.Infrastructure.Repository;

public class AppRepository : IAppRepository
{
    private readonly AppDbContext _context;
    public AppRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Restaurant?> GetRestaurantByIdAsync(Guid restaurantId)
    {
        return await _context.Restaurants
            .Include(r => r.Dishes)
            .FirstOrDefaultAsync(r => r.Id == restaurantId);
    }

    public async Task AddRestaurantAsync(Restaurant restaurant)
    {
        _context.Restaurants.Add(restaurant);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateRestaurantAsync(Restaurant restaurant)
    {
        _context.Restaurants.Update(restaurant);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteRestaurantAsync(Guid restaurantId)
    {
        Restaurant? restaurant = await _context.Restaurants.FirstOrDefaultAsync(r => r.Id == restaurantId);
        if (restaurant == null)
        {
            // will become exception
            return;
        }
        _context.Restaurants.Remove(restaurant);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> HasRestaurantsAsync()
    {
        return await _context.Restaurants.AnyAsync();
    }
}
