using Microsoft.EntityFrameworkCore;
using UberEats.Domain.Constants;
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

    public async Task<Dictionary<Guid, (decimal AverageRating, int TotalCount)>> GetAverageRatingsAndCountsAsync(
        IEnumerable<Guid> restaurantIds,
        DateTime sinceUtc)
    {
        var restaurantIdList = restaurantIds.Distinct().ToList();
        if (restaurantIdList.Count == 0)
        {
            return new Dictionary<Guid, (decimal AverageRating, int TotalCount)>();
        }

        var aggregates = await _set.AsNoTracking()
            .Where(r => restaurantIdList.Contains(r.RestaurantId) && r.CreatedAt >= sinceUtc)
            .GroupBy(r => r.RestaurantId)
            .Select(g => new
            {
                RestaurantId = g.Key,
                TotalCount = g.Count(),
                AverageRating = g.Average(r => r.Rating)
            })
            .ToListAsync();

        var result = restaurantIdList.ToDictionary(id => id, _ => (AverageRating: 0m, TotalCount: 0));
        foreach (var aggregate in aggregates)
        {
            result[aggregate.RestaurantId] = ((decimal)Math.Round(aggregate.AverageRating, 1), aggregate.TotalCount);
        }

        return result;
    }

    public async Task<(decimal AverageRating, int TotalCount)> GetAverageRatingAndCountAsync(Guid restaurantId)
    {
        var query = _set.AsNoTracking()
            .Where(r => r.RestaurantId == restaurantId && r.CreatedAt >= ReviewConstants.GetReviewCutoffDate());

        var aggregate = await query
            .GroupBy(_ => 1)
            .Select(g => new
            {
                TotalCount = g.Count(),
                AverageRating = g.Average(r => r.Rating)
            })
            .FirstOrDefaultAsync();

        if (aggregate is null)
        {
            return (0m, 0);
        }

        return ((decimal)Math.Round(aggregate.AverageRating, 1), aggregate.TotalCount);
    }
}
