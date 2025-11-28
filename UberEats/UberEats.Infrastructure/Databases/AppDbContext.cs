using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UberEats.Domain.Entities;

namespace UberEats.Infrastructure.Databases;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Address> Addresses { get; set; }
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
    public DbSet<ShoppingCartItem> ShoppingCartItems { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
    }
}
