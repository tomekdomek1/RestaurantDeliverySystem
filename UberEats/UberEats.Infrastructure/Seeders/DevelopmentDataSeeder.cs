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
        _logger.LogInformation("Rozpoczynam seedowanie bogatej bazy danych...");
        using var scope = _serviceProvider.CreateScope();
        
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        string[] roles = { UserRoles.Admin, UserRoles.User, UserRoles.RestaurantOwner, UserRoles.Deliverer };
        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
                await roleManager.CreateAsync(new IdentityRole(role));
        }

        var adminEmail = "admin@ubereats.com";
        if (await userManager.FindByEmailAsync(adminEmail) == null)
        {
            var newAdmin = new ApplicationUser { UserName = adminEmail, Email = adminEmail, FullName = "System Admin", IsActive = true };
            var result = await userManager.CreateAsync(newAdmin, "Admin123!");
            if (result.Succeeded) await userManager.AddToRoleAsync(newAdmin, UserRoles.Admin);
        }

        if (!await dbContext.Restaurants.AnyAsync())
        {
            var catBurger = new Category(Guid.NewGuid(), "Burgery", "Pyszne burgery 100% wołowiny");
            var catPizza = new Category(Guid.NewGuid(), "Pizza", "Tradycyjna włoska receptura");
            var catSushi = new Category(Guid.NewGuid(), "Sushi", "Prosto z kuchni azjatyckiej");
            await dbContext.Categories.AddRangeAsync(catBurger, catPizza, catSushi);

            var addr1 = new Address(Guid.NewGuid(), "Złota", 44, 1, "Warszawa");
            var addr2 = new Address(Guid.NewGuid(), "Rynek Główny", 1, 2, "Kraków");
            var addr3 = new Address(Guid.NewGuid(), "Półwiejska", 10, 3, "Poznań");
            await dbContext.Addresses.AddRangeAsync(addr1, addr2, addr3);

            var restBurger = new Restaurant(Guid.NewGuid(), "Burger Drwal", "123456789", "Najlepsze rzemieślnicze burgery w mieście.", addr1.Id);
            var restPizza = new Restaurant(Guid.NewGuid(), "Mamma Mia Pizza", "987654321", "Oryginalna pizza z pieca opalanego drewnem.", addr2.Id);
            var restSushi = new Restaurant(Guid.NewGuid(), "Sushi Master", "555666777", "Świeże rolki przygotowywane na Twoich oczach.", addr3.Id);
            await dbContext.Restaurants.AddRangeAsync(restBurger, restPizza, restSushi);

            var dish1 = new Dish(Guid.NewGuid(), "Burger Klasyk", "Wołowina 200g, cheddar, bekon, warzywa.", 35.99m, restBurger.Id, catBurger.Id);
            var dish2 = new Dish(Guid.NewGuid(), "Burger BBQ", "Wołowina, krążki cebulowe, sos BBQ.", 38.50m, restBurger.Id, catBurger.Id);
            var dish3 = new Dish(Guid.NewGuid(), "Frytki z cheddarem", "Grube frytki oblane serem cheddar.", 15.00m, restBurger.Id, catBurger.Id);
            
            var dish4 = new Dish(Guid.NewGuid(), "Pizza Margherita", "Pomidory San Marzano, mozzarella, bazylia.", 32.00m, restPizza.Id, catPizza.Id);
            var dish5 = new Dish(Guid.NewGuid(), "Pizza Diavola", "Mozzarella, pikantne salami, jalapeno.", 39.00m, restPizza.Id, catPizza.Id);
            
            var dish6 = new Dish(Guid.NewGuid(), "Zestaw Samuraj", "16 sztuk - różnorodne smaki i tekstury.", 59.99m, restSushi.Id, catSushi.Id);
            var dish7 = new Dish(Guid.NewGuid(), "Nigiri Łosoś", "Klasyczne nigiri ze świeżym łososiem.", 18.00m, restSushi.Id, catSushi.Id);

            await dbContext.Dishes.AddRangeAsync(dish1, dish2, dish3, dish4, dish5, dish6, dish7);
            await dbContext.SaveChangesAsync();
            _logger.LogInformation("Baza wypełniona wspaniałymi danymi!");
        }
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}