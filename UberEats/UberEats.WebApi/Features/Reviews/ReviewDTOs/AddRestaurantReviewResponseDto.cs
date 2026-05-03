namespace UberEats.WebApi.Features.Reviews.ReviewDTOs;

public class AddRestaurantReviewResponseDto
{
    public Guid Id { get; set; }
    public Guid RestaurantId { get; set; }
    public int Rating { get; set; }
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
}
