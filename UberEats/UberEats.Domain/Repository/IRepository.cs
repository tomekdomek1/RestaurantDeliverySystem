using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UberEats.Domain.Entities;

namespace UberEats.Domain.Repository;

public interface IRepository
{
    // Restaurant
    Task<Restaurant?> GetRestaurantByIdAsync(Guid restaurantId);
    Task AddRestaurantAsync(Restaurant restaurant);
    Task UpdateRestaurantAsync(Restaurant restaurant);
    Task DeleteRestaurantAsync(Guid restaurantId);
    Task<bool> HasRestaurantsAsync();
}
