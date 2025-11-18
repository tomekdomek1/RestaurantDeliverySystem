using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UberEats.Domain.Entities;
using UberEats.Domain.Repository;

namespace UberEats.Infrastructure.Seeders;

public class DevelopmentDataSeeder : IHostedService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<DevelopmentDataSeeder> _logger;
    public DevelopmentDataSeeder(IServiceProvider serviceProvider, ILogger<DevelopmentDataSeeder> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }
    public async Task StartAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Data seeder running");
        
        using var scope = _serviceProvider.CreateScope();
        var restaurantRepository = scope.ServiceProvider.GetRequiredService<IRestaurantRepository>();
        var addressRepository = scope.ServiceProvider.GetRequiredService<IAddressRepository>();

        if (await restaurantRepository.AnyAsync())
        {
            _logger.LogInformation("DB is not empty, skipping seeding");
            return;
        }

        _logger.LogInformation("DB empty. Adding a test restaurant");

        var newAddress = new Address(
            Guid.NewGuid(),
            "Towarowa",
            1,
            2,
            "Białystok"
            );

        var newRestaurant = new Restaurant(
            Guid.NewGuid(),
            "Sushi Bistro",
            "123456789",
            "Średnie, ale za to drogie",
            newAddress.Id
            );

        var newDish = new Dish(
            Guid.NewGuid(),
            "Cali Roll",
            "Jako takie",
            27.99m,
            newRestaurant.Id
            );

        newRestaurant.Dishes.Add(newDish);

        await addressRepository.AddAsync(newAddress);
        await restaurantRepository.AddAsync(newRestaurant);

        await addressRepository.SaveChangesAsync();
        await restaurantRepository.SaveChangesAsync();

        _logger.LogInformation($"Successfully asdded a new restaurant {newRestaurant.Name} with an Id:{newRestaurant.Id}");
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}
