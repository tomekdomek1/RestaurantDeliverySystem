using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UberEats.Domain.Entities;
using UberEats.Domain.Repository;

namespace UberEats.Application.Restaurants.EditRestaurant;

public class EditRestaurantCommandHandler : IRequestHandler<EditRestaurantCommand, Restaurant>
{
    private readonly IRestaurantRepository _restaurantRepository;
    public EditRestaurantCommandHandler(IRestaurantRepository restaurantRepository)
    {
        _restaurantRepository = restaurantRepository;
    }
    public async Task<Restaurant> Handle(EditRestaurantCommand request, CancellationToken cancellationToken)
    {
        var restaurantToUpdate = await _restaurantRepository.GetByIdAsync(request.Id);

        if (restaurantToUpdate == null)
        {
            return null; // maybe a custom exception
        }

        if (request.Name != null)
        {
            restaurantToUpdate.Name = request.Name;
        }

        if (request.PhoneNumber != null)
        {
            restaurantToUpdate.PhoneNumber = request.PhoneNumber;
        }

        if (request.Description != null)
        {
            restaurantToUpdate.Descrition = request.Description;
        }

        await _restaurantRepository.SaveChangesAsync();

        return restaurantToUpdate;
    }
}