using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using UberEats.Domain.Entities;

namespace UberEats.Infrastructure.Databases;

public class AppDbContext : IdentityDbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Address> Addresses { get; set; }
    public DbSet<Allergy> Allergies { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Customer> Customers { get; set; }
    public DbSet<Dish> Dishes { get; set; }
    public DbSet<Driver> Drivers { get; set; }
    public DbSet<DriverLocation> DriverLocations { get; set; }
    public DbSet<DriverShift> DriverShifts { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderAddress> OrderAddresses { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<Restaurant> Restaurants { get; set; }
    public DbSet<RestaurantReview> RestaurantReviews { get; set; }
    public DbSet<ShoppingCartItem> ShoppingCartItems { get; set; }

    public DbSet<ApplicationUser> ApplicationUsers { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<RestaurantReview>(builder =>
        {
            builder.Property(r => r.AuthorUserId)
                .IsRequired();

            builder.Property(r => r.Rating)
                .IsRequired();

            builder.Property(r => r.CreatedAt)
                .IsRequired();

            builder.Property(r => r.Description)
                .HasMaxLength(1000);

            builder.HasIndex(r => new { r.RestaurantId, r.AuthorUserId, r.CreatedAt });
            builder.HasIndex(r => new { r.RestaurantId, r.CreatedAt });

            builder.HasOne(r => r.Restaurant)
                .WithMany(r => r.Reviews)
                .HasForeignKey(r => r.RestaurantId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.ToTable(t => t.HasCheckConstraint("CK_RestaurantReviews_Rating", "\"Rating\" >= 1 AND \"Rating\" <= 5"));
        });
    }
}
