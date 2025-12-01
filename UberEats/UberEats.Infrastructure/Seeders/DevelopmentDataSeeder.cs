using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
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
        using var scope = _serviceProvider.CreateScope();
        
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var repository = scope.ServiceProvider.GetRequiredService<IRepository>();

        string[] roles = { "Admin", "User", "RestaurantOwner", "Deliverer" };

        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole(role));
            }
        }

        var adminEmail = "admin@ubereats.com";
        var adminUser = await userManager.FindByEmailAsync(adminEmail);

        if (adminUser == null)
        {
            var newAdmin = new ApplicationUser { UserName = adminEmail, Email = adminEmail, FullName = "System Admin" };
            var result = await userManager.CreateAsync(newAdmin, "Admin123!");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(newAdmin, "Admin");
            }
        }

        if (await repository.HasRestaurantsAsync())
        {
            return;
        }

        var newAddress = new Address(Guid.NewGuid(), "Towarowa", 1, 2, "Białystok");
        var newRestaurant = new Restaurant(Guid.NewGuid(), "Sushi Bistro", "123456789", "Średnie, ale za to drogie", newAddress.Id);
        var newDish = new Dish(Guid.NewGuid(), "Cali Roll", "Jako takie", 27.99m, newRestaurant.Id);

        newRestaurant.Dishes.Add(newDish);

        await repository.AddAddressAsync(newAddress);
        await repository.AddRestaurantAsync(newRestaurant);
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}