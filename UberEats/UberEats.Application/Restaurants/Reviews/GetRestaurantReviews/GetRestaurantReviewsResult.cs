using UberEats.Domain.Entities;

namespace UberEats.Application.Restaurants.Reviews.GetRestaurantReviews;

public sealed class GetRestaurantReviewsResult
{
    public List<RestaurantReview> Items { get; }
    public int PageNumber { get; }
    public int PageSize { get; }
    public int TotalCount { get; }

    public GetRestaurantReviewsResult(List<RestaurantReview> items, int pageNumber, int pageSize, int totalCount)
    {
        Items = items;
        PageNumber = pageNumber;
        PageSize = pageSize;
        TotalCount = totalCount;
    }
}
