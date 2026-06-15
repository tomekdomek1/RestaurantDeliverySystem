using MediatR;
using System;
using UberEats.Domain.Entities;
using UberEats.Domain.Enums;

namespace UberEats.Application.Restaurants.EditRestaurant;

public class EditRestaurantCommand : IRequest<Restaurant>
{
    public Guid Id { get; }
    public string? Name { get; }
    public string? PhoneNumber { get; }
    public string? Description { get; }
    public RestaurantCategory? Category { get; }

    public EditRestaurantCommand(Guid id, string? name, string? phoneNumber, string? description, RestaurantCategory? category)
    {
        Id = id;
        Name = name;
        PhoneNumber = phoneNumber;
        Description = description;
        Category = category;
    }
}