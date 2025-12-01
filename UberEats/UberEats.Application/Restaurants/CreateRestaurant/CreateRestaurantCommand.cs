using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UberEats.Domain.Entities;

namespace UberEats.Application.Restaurants.CreateRestaurant;

public class CreateRestaurantCommand : IRequest<Restaurant>
{
    public string Name { get; }
    public string PhoneNumber { get; }
    public string Description { get; }
    public Guid AddressId { get; }
    public CreateRestaurantCommand(string name, string phoneNumber, string description, Guid addressId)
    {
        Name = name;
        PhoneNumber = phoneNumber;
        Description = description;
        AddressId = addressId;
    }
}
