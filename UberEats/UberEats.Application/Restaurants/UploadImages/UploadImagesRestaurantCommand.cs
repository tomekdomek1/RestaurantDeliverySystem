using MediatR;
using UberEats.Application.Common;

namespace UberEats.Application.Restaurants.CreateRestaurant;


public class UploadImagesRestaurantCommand : IRequest<List<UploadResult>>
{
    public Guid Id { get; }
    public List<UploadFile> Images { get; } = new List<UploadFile>();
    public UploadImagesRestaurantCommand(Guid restaurantId, List<UploadFile> images)
    {
        Id = restaurantId;
        Images = images;
    }
}
