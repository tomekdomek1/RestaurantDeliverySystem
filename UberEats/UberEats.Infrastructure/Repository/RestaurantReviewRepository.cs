using Microsoft.EntityFrameworkCore;
using UberEats.Domain.Entities;
using UberEats.Domain.Repository;
using UberEats.Infrastructure.Databases;

namespace UberEats.Infrastructure.Repository;

public class RestaurantReviewRepository : RepositoryBase<RestaurantReview>, IRestaurantReviewRepository
{
    public RestaurantReviewRepository(AppDbContext context) : base(context)
    {
    }

    public Task<RestaurantReview?> GetByIdForRestaurantAsync(Guid reviewId, Guid restaurantId)
    {
        return _set.FirstOrDefaultAsync(r => r.Id == reviewId && r.RestaurantId == restaurantId);
    }

    public Task<bool> ExistsForAuthorRestaurantSinceAsync(string authorUserId, Guid restaurantId, DateTime sinceUtc)
    {
        return _set.AnyAsync(r => r.AuthorUserId == authorUserId
                                  && r.RestaurantId == restaurantId
                                  && r.CreatedAt >= sinceUtc);
    }

    public async Task<(List<RestaurantReview> Items, int TotalCount)> GetForRestaurantAsync(
        Guid restaurantId,
        DateTime sinceUtc,
        int pageNumber,
        int pageSize,
        int? minRating,
        int? maxRating,
        bool sortByRating,
        bool sortDescending)
    {
        var query = _set.AsNoTracking()
            .Where(r => r.RestaurantId == restaurantId && r.CreatedAt >= sinceUtc);

        if (minRating.HasValue)
        {
            query = query.Where(r => r.Rating >= minRating.Value);
        }

        if (maxRating.HasValue)
        {
            query = query.Where(r => r.Rating <= maxRating.Value);
        }

        var totalCount = await query.CountAsync();

        query = sortByRating
            ? (sortDescending ? query.OrderByDescending(r => r.Rating).ThenByDescending(r => r.CreatedAt) : query.OrderBy(r => r.Rating).ThenByDescending(r => r.CreatedAt))
            : (sortDescending ? query.OrderByDescending(r => r.CreatedAt) : query.OrderBy(r => r.CreatedAt));

        var items = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }
}
