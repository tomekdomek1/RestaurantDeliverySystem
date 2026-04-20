using MediatR;

namespace UberEats.Application.Restaurants.Reviews.DeleteRestaurantReview;

public sealed class DeleteRestaurantReviewCommand : IRequest
{
    public Guid RestaurantId { get; }
    public Guid ReviewId { get; }

    public DeleteRestaurantReviewCommand(Guid restaurantId, Guid reviewId)
    {
        RestaurantId = restaurantId;
        ReviewId = reviewId;
    }
}
