using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Data.Sqlite;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using UberEats.Domain.Entities;
using UberEats.Domain.Interfaces;
using UberEats.Domain.Repository;
using UberEats.Infrastructure.Databases;
using UberEats.Infrastructure.Repository;
using UberEats.Infrastructure.Services;

namespace UberEats.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            var databaseFilePath = configuration["Database:FilePath"];
            if (string.IsNullOrWhiteSpace(databaseFilePath))
            {
                databaseFilePath = "ubereats.db";
            }
            
            var sqliteConnectionString = new SqliteConnectionStringBuilder
            {
                DataSource = databaseFilePath
            }.ToString();

            services.AddDbContext<AppDbContext>(options =>
                options.UseSqlite(sqliteConnectionString));

            services.AddScoped<IRestaurantRepository, RestaurantRepository>();
            services.AddScoped<IRestaurantReviewRepository, RestaurantReviewRepository>();
            services.AddScoped<IAddressRepository, AddressRepository>();
            services.AddScoped<ICategoryRepository, CategoryRepository>();
            services.AddScoped<IFileStorage,FileSystemImageStorage>();
            services.AddScoped<ICurrentUserContext, CurrentUserContext>();
            services.AddHttpContextAccessor();

            services.AddIdentity<ApplicationUser, IdentityRole>()
                .AddEntityFrameworkStores<AppDbContext>()
                .AddDefaultTokenProviders();
            
            var jwtSettings = configuration.GetSection("JwtSettings");
            var key = Encoding.UTF8.GetBytes(jwtSettings["Key"]);
            var allowAuthorizationHeaderFallback = configuration.GetValue<bool>("Auth:AllowAuthorizationHeaderFallback");

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtSettings["Issuer"],
                    ValidAudience = jwtSettings["Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(key)
                };
                
                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        // First try to get token from cookie
                        if (context.Request.Cookies.TryGetValue("auth_token", out var token))
                        {
                            context.Token = token;
                            return Task.CompletedTask;
                        }
                        
                        // Optional fallback: allow Authorization header only when explicitly enabled.
                        var authHeader = context.Request.Headers["Authorization"].ToString();
                        if (allowAuthorizationHeaderFallback && !string.IsNullOrWhiteSpace(authHeader))
                        {
                            var parts = authHeader.Trim().Split(' ', 2, StringSplitOptions.RemoveEmptyEntries);
                            if (parts.Length == 2
                                && parts[0].Equals("Bearer", StringComparison.OrdinalIgnoreCase)
                                && !string.IsNullOrWhiteSpace(parts[1]))
                            {
                                context.Token = parts[1].Trim();
                            }
                        }
                        
                        return Task.CompletedTask;
                    }
                };
            });


            return services;
        }
    }
}
