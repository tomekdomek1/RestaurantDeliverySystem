using MediatR;
using UberEats.Application.Common;
using UberEats.Domain.Entities;
using UberEats.Domain.Repository;

namespace UberEats.Application.Restaurants.Dishes.EditDish;

public class EditDishCommandHandler : IRequestHandler<EditDishCommand, Dish>
{
    private readonly IRestaurantRepository _restaurantRepository;
    private readonly ICategoryRepository _categoryRepository;
    public EditDishCommandHandler(IRestaurantRepository restaurantRepository, ICategoryRepository categoryRepository)
    {
        _restaurantRepository = restaurantRepository;
        _categoryRepository = categoryRepository;
    }
    public async Task<Dish> Handle(EditDishCommand request, CancellationToken cancellationToken)
    {
        var restaurant = await _restaurantRepository.GetWithDishesAsync(request.RestaurantId);

        if (restaurant == null)
        {
            return null;
        }

        var dishToUpdate = restaurant.Dishes.FirstOrDefault(d => d.Id == request.Id);

        if (dishToUpdate == null)
        {
            return null;
        }

        if (request.CategoryId.HasValue)
        {
            var newCategory = await _categoryRepository.GetByIdAsync(request.CategoryId.Value);
            if (newCategory == null)
            {
                return null;
            }
        }

        MapObjects.Map(request, dishToUpdate);

        await _restaurantRepository.SaveChangesAsync();

        return dishToUpdate;
    }
}
