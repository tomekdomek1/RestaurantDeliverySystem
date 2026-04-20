using MediatR;
using UberEats.Domain.Entities;

namespace UberEats.Application.Restaurants.Reviews.AddRestaurantReview;

public sealed class AddRestaurantReviewCommand : IRequest<RestaurantReview>
{
    public Guid RestaurantId { get; }
    public int Rating { get; }
    public string? Description { get; }

    public AddRestaurantReviewCommand(Guid restaurantId, int rating, string? description)
    {
        RestaurantId = restaurantId;
        Rating = rating;
        Description = description;
    }
}
