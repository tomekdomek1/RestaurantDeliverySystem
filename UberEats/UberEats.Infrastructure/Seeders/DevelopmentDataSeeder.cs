using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using UberEats.Domain.Entities;
using UberEats.Domain.Enums;
using UberEats.Domain.Roles;
using UberEats.Domain.Repository;
using UberEats.Infrastructure.Databases;

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
        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

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

            _logger.LogInformation($"Successfully added a new restaurant {newRestaurant.Name} with an Id:{newRestaurant.Id}");
        }
        else
        {
            _logger.LogInformation("DB is not empty, skipping restaurant seeding");
        }

        if (!await dbContext.Orders.AnyAsync())
        {
            var restaurant = await dbContext.Restaurants.AsNoTracking().FirstOrDefaultAsync();
            var dish = await dbContext.Dishes.AsNoTracking().FirstOrDefaultAsync();
            var address = await dbContext.Addresses.AsNoTracking().FirstOrDefaultAsync();

            if (restaurant != null && dish != null && address != null)
            {
                var customer = await dbContext.Customers.FirstOrDefaultAsync();
                if (customer == null)
                {
                    customer = new Customer(
                        Guid.NewGuid(),
                        "Jan",
                        "Kowalski",
                        "jan.kowalski@example.com",
                        "555222111",
                        address.Id);

                    await dbContext.Customers.AddAsync(customer);
                }

                var driver = await dbContext.Drivers.FirstOrDefaultAsync();
                if (driver == null)
                {
                    driver = new Driver(
                        Guid.NewGuid(),
                        "Adam",
                        "Nowak",
                        "555111222");

                    await dbContext.Drivers.AddAsync(driver);
                }

                await dbContext.SaveChangesAsync();

                var firstOrder = new Order(
                    Guid.NewGuid(),
                    "Proszę o sos sojowy",
                    DateTime.UtcNow,
                    new TimeOnly(18, 30),
                    OrderStatus.WaitingForConfirmation,
                    customer.Id,
                    restaurant.Id,
                    driver.Id)
                {
                    TotalAmount = dish.Price * 2
                };

                firstOrder.OrderItems.Add(new OrderItem(
                    Guid.NewGuid(),
                    dish.Name,
                    dish.Price,
                    2,
                    firstOrder.Id,
                    dish.Id));

                firstOrder.OrderAddress = new OrderAddress(
                    Guid.NewGuid(),
                    address.Street,
                    address.BuildingNumber,
                    address.AppartmentNumber,
                    address.City,
                    firstOrder.Id);

                var secondOrder = new Order(
                    Guid.NewGuid(),
                    "Bez wasabi",
                    DateTime.UtcNow.AddMinutes(-30),
                    new TimeOnly(19, 0),
                    OrderStatus.IsBeingPrepared,
                    customer.Id,
                    restaurant.Id,
                    driver.Id)
                {
                    TotalAmount = dish.Price
                };

                secondOrder.OrderItems.Add(new OrderItem(
                    Guid.NewGuid(),
                    dish.Name,
                    dish.Price,
                    1,
                    secondOrder.Id,
                    dish.Id));

                secondOrder.OrderAddress = new OrderAddress(
                    Guid.NewGuid(),
                    address.Street,
                    address.BuildingNumber,
                    address.AppartmentNumber,
                    address.City,
                    secondOrder.Id);

                await dbContext.Orders.AddAsync(firstOrder);
                await dbContext.Orders.AddAsync(secondOrder);
                await dbContext.SaveChangesAsync();
            }
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
