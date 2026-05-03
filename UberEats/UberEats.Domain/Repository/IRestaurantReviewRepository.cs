using UberEats.Domain.Entities;

namespace UberEats.Domain.Repository;

public interface IRestaurantReviewRepository : IRepository<RestaurantReview>
{
    Task<RestaurantReview?> GetByIdForRestaurantAsync(Guid reviewId, Guid restaurantId);
    Task<bool> ExistsForAuthorRestaurantSinceAsync(string authorUserId, Guid restaurantId, DateTime sinceUtc);
    Task<(List<RestaurantReview> Items, int TotalCount)> GetForRestaurantAsync(
        Guid restaurantId,
        DateTime sinceUtc,
        int pageNumber,
        int pageSize,
        int? minRating,
        int? maxRating,
        bool sortByRating,
        bool sortDescending);
}
