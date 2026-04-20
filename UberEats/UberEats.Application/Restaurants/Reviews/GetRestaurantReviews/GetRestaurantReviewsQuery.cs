using MediatR;

namespace UberEats.Application.Restaurants.Reviews.GetRestaurantReviews;

public sealed class GetRestaurantReviewsQuery : IRequest<GetRestaurantReviewsResult>
{
    public Guid RestaurantId { get; }
    public int PageNumber { get; }
    public int PageSize { get; }
    public string SortBy { get; }
    public string SortDirection { get; }
    public int? MinRating { get; }
    public int? MaxRating { get; }

    public GetRestaurantReviewsQuery(
        Guid restaurantId,
        int pageNumber,
        int pageSize,
        string? sortBy,
        string? sortDirection,
        int? minRating,
        int? maxRating)
    {
        RestaurantId = restaurantId;
        PageNumber = pageNumber;
        PageSize = pageSize;
        SortBy = sortBy ?? "createdAt";
        SortDirection = sortDirection ?? "desc";
        MinRating = minRating;
        MaxRating = maxRating;
    }
}
