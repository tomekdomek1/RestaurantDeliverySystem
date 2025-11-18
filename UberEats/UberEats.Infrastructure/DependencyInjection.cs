using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.ComponentModel.Design;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UberEats.Domain.Repository;
using UberEats.Infrastructure.Databases;
using UberEats.Infrastructure.Repository;

namespace UberEats.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

        services.AddScoped<IRestaurantRepository, RestaurantRepository>();
        services.AddScoped<IAddressRepository, AddressRepository>();

        return services;
        //And then in program.cs builder.Services.AddApplication();
    }
}
