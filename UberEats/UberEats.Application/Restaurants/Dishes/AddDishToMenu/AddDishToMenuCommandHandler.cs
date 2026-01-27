using MediatR;
using UberEats.Domain.Entities;
using UberEats.Domain.Repository;

namespace UberEats.Application.Restaurants.Dishes.AddDishToMenu;

public class AddDishToMenuCommandHandler : IRequestHandler<AddDishToMenuCommand, Dish>
{
    // TODO: Do we need to check if category exists? We do not write to the Category entity so we don't need to inject it's repo
    private readonly IRestaurantRepository _restaurantRepository;
    private readonly ICategoryRepository _categoryRepository;
    public AddDishToMenuCommandHandler(IRestaurantRepository restaurantRepository, ICategoryRepository categoryRepository)
    {
        _restaurantRepository = restaurantRepository;
        _categoryRepository = categoryRepository;
    }
    public async Task<Dish> Handle(AddDishToMenuCommand request, CancellationToken cancellationToken)
    {
        var restaurant = await _restaurantRepository.GetWithDishesAsync(request.RestaurantId);
        var category = await _categoryRepository.GetByIdAsync(request.CategoryId);

        if (restaurant == null)
        {
            throw new Exception("Restaurant not found");
        }

        if (category == null)
        {
            throw new Exception("Category not found");
        }

        var dish = new Dish(
            Guid.Empty,
            request.Name,
            request.Description,
            request.Price,
            request.RestaurantId,
            request.CategoryId);

        restaurant.Dishes.Add(dish);

        await _restaurantRepository.SaveChangesAsync();

        return dish;
    }
}
