using MediatR;
using UberEats.Application.Common;
using UberEats.Application.Restaurants.UploadImages;
using UberEats.Domain.Interfaces;
using UberEats.Domain.Repository;

namespace UberEats.Application.Restaurants.CreateRestaurant;

public class UploadImagesRestaurantCommandHandler : IRequestHandler<UploadImagesRestaurantCommand, List<UploadResult>>
{
    private readonly IRestaurantRepository _restaurantRepository;
    private readonly IFileStorage _fileStorage;
    public UploadImagesRestaurantCommandHandler(IRestaurantRepository restaurantRepository, IFileStorage fileStorage)
    {
        _restaurantRepository = restaurantRepository;
        _fileStorage = fileStorage;
    }
    public async Task<List<UploadResult>> Handle(UploadImagesRestaurantCommand request, CancellationToken cancellationToken)
    {
        var restaurant = await _restaurantRepository.GetByIdAsync(request.Id);
        if (restaurant == null)
        {
            throw new Exception("Restaurant not found"); // TODO: Custom exception
        }
        var result = new List<UploadResult>();

        foreach (var file in request.Images)
        {
            if (!_fileStorage.IsFileValid(file.ContentType, file.Length))
            {
                result.Add(new UploadResult
                {
                    OriginalFileName = file.FileName,
                    IsSuccess = false,
                    ErrorMessage = "Invalid file. Only jpeg is allowed. Max size is 5MB"
                });
                continue;
            }

            // Dont know if filepath should be stored in DB or not, propably it should
            var imageId = Guid.NewGuid();
            var path = $"{restaurant.Id}/CommonImages/{imageId}.{file.ContentType.Split('/')[1]}";

            await _fileStorage.SaveAsync(file.Content, path);

            result.Add(new UploadResult
            {
                IsSuccess = true,
                OriginalFileName = file.FileName,
                RelativeFilePath = path
            });
        }

        return result;

    }

}

