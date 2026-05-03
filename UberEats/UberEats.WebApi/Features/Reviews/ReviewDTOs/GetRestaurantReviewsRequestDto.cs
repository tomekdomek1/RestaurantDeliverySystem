namespace UberEats.WebApi.Features.Reviews.ReviewDTOs;

public class GetRestaurantReviewsRequestDto
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string SortBy { get; set; } = "createdAt";
    public string SortDirection { get; set; } = "desc";
    public int? MinRating { get; set; }
    public int? MaxRating { get; set; }
}
