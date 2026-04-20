using MediatR;
using UberEats.Domain.Entities;
using UberEats.Domain.Interfaces;
using UberEats.Domain.Repository;

namespace UberEats.Application.Restaurants.Reviews.AddRestaurantReview;

public sealed class AddRestaurantReviewCommandHandler : IRequestHandler<AddRestaurantReviewCommand, RestaurantReview>
{
    private const string UserRole = "User";
    private readonly IRestaurantRepository _restaurantRepository;
    private readonly IRestaurantReviewRepository _restaurantReviewRepository;
    private readonly ICurrentUserContext _currentUserContext;

    public AddRestaurantReviewCommandHandler(
        IRestaurantRepository restaurantRepository,
        IRestaurantReviewRepository restaurantReviewRepository,
        ICurrentUserContext currentUserContext)
    {
        _restaurantRepository = restaurantRepository;
        _restaurantReviewRepository = restaurantReviewRepository;
        _currentUserContext = currentUserContext;
    }

    public async Task<RestaurantReview> Handle(AddRestaurantReviewCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserContext.UserId;
        if (!_currentUserContext.IsAuthenticated || string.IsNullOrWhiteSpace(userId))
        {
            throw new UnauthorizedAccessException("User is not authenticated.");
        }

        if (!_currentUserContext.IsInRole(UserRole))
        {
            throw new UnauthorizedAccessException("Only users with role User can add reviews.");
        }

        if (request.Rating < 1 || request.Rating > 5)
        {
            throw new ApplicationException("Rating must be between 1 and 5.");
        }

        var restaurantExists = await _restaurantRepository.ExistsAsync(request.RestaurantId);
        if (!restaurantExists)
        {
            throw new KeyNotFoundException("Restaurant not found.");
        }

        var minimumAllowedDate = DateTime.UtcNow.AddMonths(-3);
        var hasRecentReview = await _restaurantReviewRepository.ExistsForAuthorRestaurantSinceAsync(
            userId,
            request.RestaurantId,
            minimumAllowedDate);

        if (hasRecentReview)
        {
            throw new ApplicationException("You can add only one review for this restaurant within 3 months.");
        }

        var review = new RestaurantReview(
            Guid.NewGuid(),
            request.RestaurantId,
            userId,
            request.Rating,
            request.Description,
            DateTime.UtcNow);

        await _restaurantReviewRepository.AddAsync(review);
        await _restaurantReviewRepository.SaveChangesAsync();

        return review;
    }
}
