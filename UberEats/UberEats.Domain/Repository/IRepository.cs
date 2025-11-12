using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UberEats.Domain.Entities;

namespace UberEats.Domain.Repository;

// TODO: Create an inheritance structure for Repositories

public interface IRepository
{
    // Restaurant
    Task<Restaurant?> GetRestaurantByIdAsync(Guid restaurantId);
    Task AddRestaurantAsync(Restaurant restaurant);
    Task UpdateRestaurantAsync(Restaurant restaurant);
    Task DeleteRestaurantAsync(Guid restaurantId);
    Task<bool> HasRestaurantsAsync();

    // Shouldn't be here - testing
    Task AddAddressAsync(Address address);
}
