using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UberEats.Domain.Entities;
using UberEats.Domain.Enums;

namespace UberEats.Application.Restaurants.CreateRestaurant;

public class CreateRestaurantCommand : IRequest<Restaurant>
{
    public string Name { get; }
    public string PhoneNumber { get; }
    public string Description { get; }
    public Guid AddressId { get; }
    public RestaurantCategory Category { get; }

    public CreateRestaurantCommand(string name, string phoneNumber, string description, Guid addressId, RestaurantCategory category)
    {
        Name = name;
        PhoneNumber = phoneNumber;
        Description = description;
        AddressId = addressId;
        Category = category;
    }
}