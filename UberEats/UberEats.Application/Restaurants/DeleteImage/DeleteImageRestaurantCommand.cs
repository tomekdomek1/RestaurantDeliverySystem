using MediatR;

namespace UberEats.Application.Restaurants.DeleteImage;

public class DeleteImageRestaurantCommand : IRequest<bool>
{
    public Guid RestaurantId { get; }
    public Guid ImageId { get; }
    public DeleteImageRestaurantCommand(Guid restaurantId, Guid imageId)
    {
        RestaurantId = restaurantId;
        ImageId = imageId;
    }
}
