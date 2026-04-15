using MediatR;
using UberEats.Application.Restaurants.Dishes.GetDishes;
using UberEats.Domain.Entities;
using UberEats.Domain.Repository;

namespace UberEats.Application.Restaurants.Queries.GetDishes;

public class GetDishesQueryHandler : IRequestHandler<GetDishesQuery, IEnumerable<Dish>>
{
    private readonly IRestaurantRepository _restaurantRepository;

    public GetDishesQueryHandler(IRestaurantRepository restaurantRepository)
    {
        _restaurantRepository = restaurantRepository;
    }

    public async Task<IEnumerable<Dish>> Handle(GetDishesQuery request, CancellationToken cancellationToken)
    {
        var restaurant = await _restaurantRepository.GetWithDishesAsync(request.RestaurantId);

        if (restaurant is null)
        {
            throw new Exception("Restaurant not found");
        }

        return restaurant.Dishes;
    }
}