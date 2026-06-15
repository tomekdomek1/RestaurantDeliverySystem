using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using UberEats.Domain.Entities;
using UberEats.Domain.Enums;
using UberEats.Domain.Roles;
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

        // 1. TWORZENIE RÓL
        string[] roles = { UserRoles.Admin, UserRoles.User, UserRoles.RestaurantOwner, UserRoles.Deliverer };
        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
                await roleManager.CreateAsync(new IdentityRole(role));
        }

        // 2. TWORZENIE UŻYTKOWNIKÓW (z naprawionymi ostrzeżeniami CS8600)
        var adminEmail = "admin@ubereats.com";
        ApplicationUser? adminUser = await userManager.FindByEmailAsync(adminEmail);
        if (adminUser == null)
        {
            adminUser = new ApplicationUser { UserName = adminEmail, Email = adminEmail, FullName = "System Admin", IsActive = true };
            await userManager.CreateAsync(adminUser, "Admin123!");
            await userManager.AddToRoleAsync(adminUser, UserRoles.Admin);
        }

        var ownerEmail = "owner@ubereats.com";
        ApplicationUser? ownerUser = await userManager.FindByEmailAsync(ownerEmail);
        if (ownerUser == null)
        {
            ownerUser = new ApplicationUser { UserName = ownerEmail, Email = ownerEmail, FullName = "Janusz Biznesu", IsActive = true };
            await userManager.CreateAsync(ownerUser, "Owner123!");
            await userManager.AddToRoleAsync(ownerUser, UserRoles.RestaurantOwner);
        }

        var delivererEmail = "deliverer@ubereats.com";
        ApplicationUser? delivererUser = await userManager.FindByEmailAsync(delivererEmail);
        if (delivererUser == null)
        {
            delivererUser = new ApplicationUser { UserName = delivererEmail, Email = delivererEmail, FullName = "Szybki Maciek", IsActive = true };
            await userManager.CreateAsync(delivererUser, "Deliverer123!");
            await userManager.AddToRoleAsync(delivererUser, UserRoles.Deliverer);
        }

        var user1Email = "user1@ubereats.com";
        ApplicationUser? user1 = await userManager.FindByEmailAsync(user1Email);
        if (user1 == null)
        {
            user1 = new ApplicationUser { UserName = user1Email, Email = user1Email, FullName = "Kasia Kowalska", IsActive = true };
            await userManager.CreateAsync(user1, "User123!");
            await userManager.AddToRoleAsync(user1, UserRoles.User);
        }

        var user2Email = "user2@ubereats.com";
        ApplicationUser? user2 = await userManager.FindByEmailAsync(user2Email);
        if (user2 == null)
        {
            user2 = new ApplicationUser { UserName = user2Email, Email = user2Email, FullName = "Tomasz Nowak", IsActive = true };
            await userManager.CreateAsync(user2, "User123!");
            await userManager.AddToRoleAsync(user2, UserRoles.User);
        }

        var user3Email = "user3@ubereats.com";
        ApplicationUser? user3 = await userManager.FindByEmailAsync(user3Email);
        if (user3 == null)
        {
            user3 = new ApplicationUser { UserName = user3Email, Email = user3Email, FullName = "Anna Lewandowska", IsActive = true };
            await userManager.CreateAsync(user3, "User123!");
            await userManager.AddToRoleAsync(user3, UserRoles.User);
        }

        // 3. TWORZENIE RESTAURACJI, DAŃ I OPINII
        if (!await dbContext.Restaurants.AnyAsync())
        {
            // Kategorie Dań (stara encja Category)
            var catBurger = new Category(Guid.NewGuid(), "Burgery", "Pyszne burgery 100% wołowiny");
            var catPizza = new Category(Guid.NewGuid(), "Pizza", "Tradycyjna włoska receptura");
            var catSushi = new Category(Guid.NewGuid(), "Sushi", "Prosto z kuchni azjatyckiej");
            var catKebab = new Category(Guid.NewGuid(), "Kebab", "Opiekane mięso na ostro");
            var catVegan = new Category(Guid.NewGuid(), "Wegańskie", "100% roślinne smaki");
            var catAsian = new Category(Guid.NewGuid(), "Azjatyckie", "Wok, pad thai i orientalne smaki");
            var catItalian = new Category(Guid.NewGuid(), "Włoskie", "Pasty, gnocchi i owoce morza");
            var catPolish = new Category(Guid.NewGuid(), "Polskie", "Tradycyjne domowe obiady");
            await dbContext.Categories.AddRangeAsync(catBurger, catPizza, catSushi, catKebab, catVegan, catAsian, catItalian, catPolish);

            // Adresy
            var addr1 = new Address(Guid.NewGuid(), "Złota", 44, 1, "Warszawa");
            var addr2 = new Address(Guid.NewGuid(), "Rynek Główny", 1, 2, "Kraków");
            var addr3 = new Address(Guid.NewGuid(), "Półwiejska", 10, 3, "Poznań");
            var addr4 = new Address(Guid.NewGuid(), "Piotrkowska", 100, 4, "Łódź");
            var addr5 = new Address(Guid.NewGuid(), "Długa", 5, 5, "Gdańsk");
            var addr6 = new Address(Guid.NewGuid(), "Sikorskiego", 12, 1, "Rzeszów");
            var addr7 = new Address(Guid.NewGuid(), "Świdnicka", 8, 2, "Wrocław");
            var addr8 = new Address(Guid.NewGuid(), "Krupówki", 40, 1, "Zakopane");
            await dbContext.Addresses.AddRangeAsync(addr1, addr2, addr3, addr4, addr5, addr6, addr7, addr8);

            // Restauracje z nowymi Enumami
            var restBurger = new Restaurant(Guid.NewGuid(), "Burger Drwal", "123456789", "Najlepsze rzemieślnicze burgery w mieście. 100% lokalna wołowina.", addr1.Id, RestaurantCategory.Burgers);
            var restPizza = new Restaurant(Guid.NewGuid(), "Mamma Mia Pizza", "987654321", "Oryginalna pizza z pieca opalanego drewnem sprowadzanym z Neapolu.", addr2.Id, RestaurantCategory.Pizza);
            var restSushi = new Restaurant(Guid.NewGuid(), "Sushi Master", "555666777", "Świeże rolki przygotowywane na Twoich oczach przez mistrzów z Japonii.", addr3.Id, RestaurantCategory.Sushi);
            var restKebab = new Restaurant(Guid.NewGuid(), "Kebab u Aliego", "111222333", "Prawdziwy turecki kebab z baraniną, robiony według sekretnej receptury.", addr4.Id, RestaurantCategory.Kebab);
            var restVegan = new Restaurant(Guid.NewGuid(), "Zielony Talerz", "444555666", "100% roślinna kuchnia z całego świata. Zdrowo, kolorowo i bez okrucieństwa.", addr5.Id, RestaurantCategory.Vegan);
            var restAsian = new Restaurant(Guid.NewGuid(), "Wok & Roll", "777888999", "Najlepszy Pad Thai i chrupiąca kaczka po pekińsku w Twojej okolicy.", addr6.Id, RestaurantCategory.Asian);
            var restItalian = new Restaurant(Guid.NewGuid(), "Pasta Bella", "222333444", "Ręcznie robione makarony, świeże owoce morza i doskonałe wina.", addr7.Id, RestaurantCategory.Italian);
            var restPolish = new Restaurant(Guid.NewGuid(), "Chłopskie Jadło", "999000111", "Tradycyjny schabowy, domowe pierogi i żurek jak u babci.", addr8.Id, RestaurantCategory.Polish);

            await dbContext.Restaurants.AddRangeAsync(restBurger, restPizza, restSushi, restKebab, restVegan, restAsian, restItalian, restPolish);

            // Dania
            var dishes = new List<Dish>
            {
                new Dish(Guid.NewGuid(), "Burger Klasyk", "Wołowina 200g, cheddar, bekon, warzywa, sos autorski.", 35.99m, restBurger.Id, catBurger.Id),
                new Dish(Guid.NewGuid(), "Burger Ostre Cięcie", "Wołowina, jalapeno, sos sriracha, nachosy.", 38.50m, restBurger.Id, catBurger.Id),
                new Dish(Guid.NewGuid(), "Frytki z Batatów", "Chrupiące frytki z batatów z sosem czosnkowym.", 16.00m, restBurger.Id, catBurger.Id),

                new Dish(Guid.NewGuid(), "Pizza Margherita", "Pomidory San Marzano, mozzarella fior di latte, bazylia.", 32.00m, restPizza.Id, catPizza.Id),
                new Dish(Guid.NewGuid(), "Pizza Diavola", "Mozzarella, pikantne salami spianata, papryczki chili.", 39.00m, restPizza.Id, catPizza.Id),
                new Dish(Guid.NewGuid(), "Focaccia", "Cienkie ciasto z oliwą z oliwek, solą morską i rozmarynem.", 15.00m, restPizza.Id, catPizza.Id),

                new Dish(Guid.NewGuid(), "Zestaw Samuraj", "16 sztuk - 8x California Maki, 4x Nigiri, 4x Hosomaki.", 59.99m, restSushi.Id, catSushi.Id),
                new Dish(Guid.NewGuid(), "Zestaw Ninja", "32 sztuki - idealne dla dwojga. Różnorodne smaki.", 99.00m, restSushi.Id, catSushi.Id),

                new Dish(Guid.NewGuid(), "Kebab w cieście Rollo", "Duża porcja mięsa z frytkami i sosem czosnkowym.", 28.00m, restKebab.Id, catKebab.Id),
                new Dish(Guid.NewGuid(), "Kebab na talerzu", "Wołowina-baranina, frytki, zestaw surówek, sos mieszany.", 35.00m, restKebab.Id, catKebab.Id),

                new Dish(Guid.NewGuid(), "Wegański Bowl", "Komosa ryżowa, awokado, marynowane tofu, pieczone bataty, sos tahini.", 34.00m, restVegan.Id, catVegan.Id),
                new Dish(Guid.NewGuid(), "Burger Beyond", "Roślinny kotlet Beyond Meat, wegański ser, świeże warzywa.", 39.00m, restVegan.Id, catVegan.Id),

                new Dish(Guid.NewGuid(), "Pad Thai Kurczak", "Makaron ryżowy, jajko, kiełki mung, orzeszki ziemne, tamarind.", 36.00m, restAsian.Id, catAsian.Id),
                new Dish(Guid.NewGuid(), "Kurczak Słodko-Kwaśny", "Kawałki kurczaka w cieście, ananas, papryka, ryż jaśminowy.", 32.00m, restAsian.Id, catAsian.Id),

                new Dish(Guid.NewGuid(), "Spaghetti Carbonara", "Pancetta, żółtko, ser pecorino romano, czarny pieprz.", 38.00m, restItalian.Id, catItalian.Id),
                new Dish(Guid.NewGuid(), "Tagliatelle al Tartufo", "Makaron z sosem śmietanowym, czarną truflą i parmezanem.", 45.00m, restItalian.Id, catItalian.Id),

                new Dish(Guid.NewGuid(), "Tradycyjny Schabowy", "Panierowany kotlet wieprzowy z ziemniakami i kapustą zasmażaną.", 33.00m, restPolish.Id, catPolish.Id),
                new Dish(Guid.NewGuid(), "Pierogi Ruskie", "10 sztuk, okraszone cebulką.", 25.00m, restPolish.Id, catPolish.Id)
            };
            await dbContext.Dishes.AddRangeAsync(dishes);

            // Opinie (Zabezpieczenie znakami '!' przed ostrzeżeniami o null)
            var reviews = new List<RestaurantReview>
            {
                // Opinie dla Burgera
                new RestaurantReview(Guid.NewGuid(), restBurger.Id, user1!.Id, 5, "Najlepszy drwal jakiego jadłem! Mięso idealnie wysmażone, bułka chrupiąca. Będę wracać.", DateTime.UtcNow.AddDays(-2)),
                new RestaurantReview(Guid.NewGuid(), restBurger.Id, user2!.Id, 4, "Burgery pierwsza klasa, ale frytki dotarły lekko chłodne.", DateTime.UtcNow.AddDays(-1)),
                new RestaurantReview(Guid.NewGuid(), restBurger.Id, user3!.Id, 5, "Absolutny hit. Sos autorski robi całą robotę.", DateTime.UtcNow.AddHours(-12)),

                // Opinie dla Pizzy
                new RestaurantReview(Guid.NewGuid(), restPizza.Id, user1!.Id, 5, "Prawdziwa włoska robota! Ciasto cieniutkie, boki puszyste, a składniki z najwyższej półki.", DateTime.UtcNow.AddDays(-5)),
                new RestaurantReview(Guid.NewGuid(), restPizza.Id, user2!.Id, 2, "Zamówiłem Diavolę i była zdecydowanie za ostra, nie dało się zjeść. Powinno być jakieś ostrzeżenie.", DateTime.UtcNow.AddDays(-10)),
                
                // Opinie dla Sushi
                new RestaurantReview(Guid.NewGuid(), restSushi.Id, user3!.Id, 5, "Niesamowicie świeża ryba. Polecam każdemu zestaw Samuraj, świetnie skomponowane smaki.", DateTime.UtcNow.AddHours(-5)),
                new RestaurantReview(Guid.NewGuid(), restSushi.Id, user1!.Id, 5, "Dostawa na czas, elegancko zapakowane.", DateTime.UtcNow.AddDays(-20)),

                // Opinie dla Kebaba
                new RestaurantReview(Guid.NewGuid(), restKebab.Id, user1!.Id, 4, "Wielka porcja, dużo mięsa, ale sos czosnkowy mógłby być bardziej wyrazisty.", DateTime.UtcNow.AddDays(-14)),
                new RestaurantReview(Guid.NewGuid(), restKebab.Id, user2!.Id, 3, "Kebab poprawny, jadłem lepsze. Mięso trochę przesuszone.", DateTime.UtcNow.AddDays(-1)),

                // Opinie dla Wegańskiej
                new RestaurantReview(Guid.NewGuid(), restVegan.Id, user2!.Id, 5, "Nawet jako zagorzały mięsożerca jestem zachwycony. Wegański bowl to absolutny sztos!", DateTime.UtcNow.AddDays(-3)),
                new RestaurantReview(Guid.NewGuid(), restVegan.Id, user3!.Id, 5, "Mega zdrowe i przepyszne. Zamawiam tu co tydzień.", DateTime.UtcNow.AddDays(-8)),

                // Opinie dla Azjatyckiej
                new RestaurantReview(Guid.NewGuid(), restAsian.Id, user1!.Id, 5, "Najlepszy Pad Thai w mieście. Idealne proporcje słodko-słono-kwaśne.", DateTime.UtcNow.AddDays(-4)),

                // Opinie dla Włoskiej
                new RestaurantReview(Guid.NewGuid(), restItalian.Id, user3!.Id, 5, "Carbonara perfekcyjna - bez grama śmietany, dokładnie tak jak robią w Rzymie!", DateTime.UtcNow.AddDays(-6)),

                // Opinie dla Polskiej
                new RestaurantReview(Guid.NewGuid(), restPolish.Id, user2!.Id, 5, "Schabowy wielki jak talerz, ziemniaczki z koperkiem, pychota. Prawie tak dobre jak u mamy.", DateTime.UtcNow.AddDays(-2)),
                new RestaurantReview(Guid.NewGuid(), restPolish.Id, user1!.Id, 4, "Pierogi rewelacyjne, ale trochę za mało cebulki na wierzchu.", DateTime.UtcNow.AddDays(-1))
            };
            await dbContext.AddRangeAsync(reviews);

            await dbContext.SaveChangesAsync();
            _logger.LogInformation("Baza wypełniona NAJLEPSZYMI danymi! (Użytkownicy, Kategorie, Restauracje, Dania i Opinie).");
        }
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}