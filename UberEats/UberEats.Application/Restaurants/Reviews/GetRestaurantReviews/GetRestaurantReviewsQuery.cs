using MediatR;
using UberEats.Domain.Repository;

namespace UberEats.Application.Restaurants.Reviews.GetRestaurantReviews;

public sealed record GetRestaurantReviewsQuery(
    Guid RestaurantId,
    int PageNumber,
    int PageSize,
    string? SortBy,
    string? SortDirection,
    int? MinRating,
    int? MaxRating) : IRequest<GetRestaurantReviewsResult>
{
    public int PageNumber { get; } = PageNumber < 1 ? 1 : PageNumber;
    public int PageSize { get; } = PageSize <= 0 ? 10 : PageSize;
    public string SortBy { get; } = (SortBy ?? "createdAt").Trim();
    public string SortDirection { get; } = (SortDirection ?? "desc").Trim();
}

public sealed class GetRestaurantReviewsQueryHandler : IRequestHandler<GetRestaurantReviewsQuery, GetRestaurantReviewsResult>
{
    private const int MaxPageSize = 50;

    private readonly IRestaurantRepository _restaurantRepository;
    private readonly IRestaurantReviewRepository _restaurantReviewRepository;

    public GetRestaurantReviewsQueryHandler(
        IRestaurantRepository restaurantRepository,
        IRestaurantReviewRepository restaurantReviewRepository)
    {
        _restaurantRepository = restaurantRepository;
        _restaurantReviewRepository = restaurantReviewRepository;
    }

    public async Task<GetRestaurantReviewsResult> Handle(GetRestaurantReviewsQuery request, CancellationToken cancellationToken)
    {
        if (!await _restaurantRepository.ExistsAsync(request.RestaurantId))
        {
            throw new KeyNotFoundException("Restaurant not found.");
        }

        if (request.MinRating is < 1 or > 5 || request.MaxRating is < 1 or > 5)
        {
            throw new ApplicationException("Rating filter must be between 1 and 5.");
        }

        if (request.MinRating.HasValue && request.MaxRating.HasValue && request.MinRating > request.MaxRating)
        {
            throw new ApplicationException("minRating cannot be greater than maxRating.");
        }

        var normalizedPageNumber = request.PageNumber;
        var normalizedPageSize = Math.Min(request.PageSize, MaxPageSize);
        var normalizedSortBy = request.SortBy.ToLowerInvariant();
        var normalizedSortDirection = request.SortDirection.ToLowerInvariant();

        if (normalizedSortBy is not ("createdat" or "rating"))
        {
            throw new ApplicationException("sortBy must be one of: createdAt, rating.");
        }

        if (normalizedSortDirection is not ("asc" or "desc"))
        {
            throw new ApplicationException("sortDirection must be one of: asc, desc.");
        }

        var sinceUtc = DateTime.UtcNow.AddMonths(-3);
        var sortByRating = normalizedSortBy == "rating";
        var sortDescending = normalizedSortDirection == "desc";

        var (items, totalCount) = await _restaurantReviewRepository.GetForRestaurantAsync(
            request.RestaurantId,
            sinceUtc,
            normalizedPageNumber,
            normalizedPageSize,
            request.MinRating,
            request.MaxRating,
            sortByRating,
            sortDescending);

        return new GetRestaurantReviewsResult(items, normalizedPageNumber, normalizedPageSize, totalCount);
    }
}
