using MediatR;
using System;
using UberEats.Domain.Entities;

namespace UberEats.Application.Restaurants.EditRestaurant;

public class EditRestaurantCommand : IRequest<Restaurant>
{
    public Guid Id { get; }
    public string? Name { get; }
    public string? PhoneNumber { get; }
    public string? Description { get; }
    public EditRestaurantCommand(Guid id, string? name, string? phoneNumber, string? description)
    {
        Id = id;
        Name = name;
        PhoneNumber = phoneNumber;
        Description = description;
    }
}
