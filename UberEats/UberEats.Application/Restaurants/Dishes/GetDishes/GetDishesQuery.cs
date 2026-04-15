using MediatR;
using UberEats.Domain.Entities;

namespace UberEats.Application.Restaurants.Dishes.GetDishes;

public record GetDishesQuery(Guid RestaurantId) : IRequest<IEnumerable<Dish>>;
