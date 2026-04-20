using MediatR;
using UberEats.Domain.Interfaces;
using UberEats.Domain.Roles;
using UberEats.Domain.Repository;

namespace UberEats.Application.Restaurants.Reviews.DeleteRestaurantReview;

public sealed class DeleteRestaurantReviewCommandHandler : IRequestHandler<DeleteRestaurantReviewCommand>
{
    private readonly IRestaurantReviewRepository _restaurantReviewRepository;
    private readonly ICurrentUserContext _currentUserContext;

    public DeleteRestaurantReviewCommandHandler(
        IRestaurantReviewRepository restaurantReviewRepository,
        ICurrentUserContext currentUserContext)
    {
        _restaurantReviewRepository = restaurantReviewRepository;
        _currentUserContext = currentUserContext;
    }

    public async Task Handle(DeleteRestaurantReviewCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserContext.UserId;
        if (!_currentUserContext.IsAuthenticated || string.IsNullOrWhiteSpace(userId))
        {
            throw new UnauthorizedAccessException("User is not authenticated.");
        }

        var review = await _restaurantReviewRepository.GetByIdForRestaurantAsync(request.ReviewId, request.RestaurantId);
        if (review == null)
        {
            throw new KeyNotFoundException("Review not found.");
        }

        var isAdmin = _currentUserContext.IsInRole(UserRoles.Admin);
        var isAuthor = review.AuthorUserId == userId;
        if (!isAdmin && !isAuthor)
        {
            throw new UnauthorizedAccessException("Only admin or review author can delete this review.");
        }

        await _restaurantReviewRepository.DeleteAsync(review.Id);
        await _restaurantReviewRepository.SaveChangesAsync();
    }
}
