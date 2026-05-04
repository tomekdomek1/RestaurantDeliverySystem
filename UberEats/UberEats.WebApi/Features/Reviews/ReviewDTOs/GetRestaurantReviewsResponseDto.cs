namespace UberEats.WebApi.Features.Reviews.ReviewDTOs;

public class GetRestaurantReviewsResponseDto
{
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public int TotalCount { get; set; }
    public List<GetRestaurantReviewItemDto> Items { get; set; } = [];
}

public class GetRestaurantReviewItemDto
{
    public Guid Id { get; set; }
    public int Rating { get; set; }
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
}
