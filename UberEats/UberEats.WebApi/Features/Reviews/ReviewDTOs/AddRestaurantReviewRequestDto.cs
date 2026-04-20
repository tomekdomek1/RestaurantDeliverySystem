using System.ComponentModel.DataAnnotations;

namespace UberEats.WebApi.Features.Reviews.ReviewDTOs;

public class AddRestaurantReviewRequestDto
{
    [Required]
    [Range(1, 5)]
    public int Rating { get; set; }

    public string? Description { get; set; }
}
