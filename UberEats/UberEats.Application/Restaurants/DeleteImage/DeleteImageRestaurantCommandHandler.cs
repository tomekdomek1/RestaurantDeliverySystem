using MediatR;
using UberEats.Domain.Interfaces;
using UberEats.Domain.Repository;

namespace UberEats.Application.Restaurants.DeleteImage;

public class DeleteImageRestaurantCommandHandler : IRequestHandler<DeleteImageRestaurantCommand, bool>
{
    private readonly IRestaurantRepository _restaurantRepository;
    private readonly IFileStorage _fileStorage;

    public DeleteImageRestaurantCommandHandler(IRestaurantRepository restaurantRepository, IFileStorage fileStorage)
    {
        _restaurantRepository = restaurantRepository;
        _fileStorage = fileStorage;
    }

    public async Task<bool> Handle(DeleteImageRestaurantCommand request, CancellationToken cancellationToken)
    {
        var restaurant = await _restaurantRepository.GetByIdAsync(request.RestaurantId);
        if (restaurant == null)
        {
            throw new Exception("Restaurant not found");  // TODO: Custom exception
        }
        var path = $"{restaurant.Id}/CommonImages/{request.ImageId}.jpeg";

        return await _fileStorage.DeleteFileAsync(path);
    }
}
