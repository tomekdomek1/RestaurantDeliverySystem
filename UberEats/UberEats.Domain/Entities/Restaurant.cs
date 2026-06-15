using System;
using System.Collections.Generic;
using UberEats.Domain.Common.Models;
using UberEats.Domain.Enums;

namespace UberEats.Domain.Entities;

public sealed class Restaurant : Entity<Guid>
{
    public string Name { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string Descrition { get; set; } = string.Empty;
    public Guid AddressId { get; set; }
    public Address Address { get; set; } = null!;
    public RestaurantCategory Category { get; set; } = RestaurantCategory.Other;
    
    public ICollection<Dish> Dishes { get; set; } = new List<Dish>();
    public ICollection<Order> Orders { get; set; } = new List<Order>();
    public ICollection<RestaurantReview> Reviews { get; set; } = new List<RestaurantReview>();

    public Restaurant(Guid id, string name, string phoneNumber, string descrition, Guid addressId, RestaurantCategory category = RestaurantCategory.Other) : base(id)
    {
        Name = name;
        PhoneNumber = phoneNumber;
        Descrition = descrition;
        AddressId = addressId;
        Category = category;
    }
}