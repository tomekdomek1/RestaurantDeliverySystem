using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UberEats.Application.Restaurants.Dishes.DeleteDish;

public class DeleteDishCommand : IRequest
{
    public Guid DishId { get; }
    public Guid RestaurantId { get; }

    public DeleteDishCommand(Guid dishId, Guid restaurantId)
    {
        DishId = dishId;
        RestaurantId = restaurantId;
    }
}
