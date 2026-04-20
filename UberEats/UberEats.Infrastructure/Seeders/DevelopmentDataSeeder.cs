using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using UberEats.Domain.Entities;
using UberEats.Domain.Roles;
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
        var categoryRepository = scope.ServiceProvider.GetRequiredService<ICategoryRepository>();

        var hasRestaurants = await restaurantRepository.AnyAsync();
        if (!hasRestaurants)
        {
            _logger.LogInformation("DB empty. Adding a test restaurant");

            var newCategory = new Category(
                Guid.NewGuid(),
                "Sushi",
                "z biedronki"
                );

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
                newRestaurant.Id,
                newCategory.Id
                );

            newRestaurant.Dishes.Add(newDish);

            await categoryRepository.AddAsync(newCategory);
            await addressRepository.AddAsync(newAddress);
            await restaurantRepository.AddAsync(newRestaurant);

            await categoryRepository.SaveChangesAsync();
            await addressRepository.SaveChangesAsync();
            await restaurantRepository.SaveChangesAsync();

            _logger.LogInformation($"Successfully asdded a new restaurant {newRestaurant.Name} with an Id:{newRestaurant.Id}");
        }
        else
        {
            _logger.LogInformation("DB is not empty, skipping restaurant seeding");
        }

        //Seeding Roles and Admin User
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();

        string[] roles = { UserRoles.Admin, UserRoles.User, UserRoles.RestaurantOwner, UserRoles.Deliverer };

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
                await userManager.AddToRoleAsync(newAdmin, UserRoles.Admin);
            }
        }

        _logger.LogInformation($"Roles and admin user were created Successfully ");

    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}
