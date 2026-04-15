using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UberEats.Domain.Repository;

namespace UberEats.Application.Restaurants.Dishes.DeleteDish;

public class DeleteDishCommandHandler : IRequestHandler<DeleteDishCommand>
{
    private readonly IRestaurantRepository _restaurantRepository;

    public DeleteDishCommandHandler(IRestaurantRepository restaurantRepository)
    {
        _restaurantRepository = restaurantRepository;
    }

    public async Task Handle(DeleteDishCommand request, CancellationToken cancellationToken)
    {
        var restaurant = await _restaurantRepository.GetWithDishesAsync(request.RestaurantId);

        if (restaurant == null)
        {
            return;
        }

        var dishToDelete = restaurant.Dishes.FirstOrDefault(d => d.Id == request.DishId);

        if (dishToDelete == null)
        {
            return;
        }

        restaurant.Dishes.Remove(dishToDelete);

        await _restaurantRepository.SaveChangesAsync();
    }
}
