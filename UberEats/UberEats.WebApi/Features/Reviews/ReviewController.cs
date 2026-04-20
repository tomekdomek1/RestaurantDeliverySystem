using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UberEats.Application.Restaurants.Reviews.AddRestaurantReview;
using UberEats.Application.Restaurants.Reviews.DeleteRestaurantReview;
using UberEats.Application.Restaurants.Reviews.GetRestaurantReviews;
using UberEats.Domain.Roles;
using UberEats.WebApi.Features.Reviews.ReviewDTOs;

namespace UberEats.WebApi.Features.Reviews;

[Route("api/restaurants/{restaurantId:Guid}/reviews")]
[ApiController]
public class ReviewController : ControllerBase
{
    private readonly IMediator _mediator;

    public ReviewController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetReviews(Guid restaurantId, [FromQuery] GetRestaurantReviewsRequestDto request)
    {
        var result = await _mediator.Send(new GetRestaurantReviewsQuery(
            restaurantId,
            request.PageNumber,
            request.PageSize,
            request.SortBy,
            request.SortDirection,
            request.MinRating,
            request.MaxRating));

        var response = new GetRestaurantReviewsResponseDto
        {
            PageNumber = result.PageNumber,
            PageSize = result.PageSize,
            TotalCount = result.TotalCount,
            Items = result.Items.Select(r => new GetRestaurantReviewItemDto
            {
                Id = r.Id,
                Rating = r.Rating,
                Description = r.Description,
                CreatedAt = r.CreatedAt
            }).ToList()
        };

        return Ok(response);
    }

    [HttpPost]
    [Authorize(Roles = UserRoles.User)]
    public async Task<IActionResult> AddReview(Guid restaurantId, [FromBody] AddRestaurantReviewRequestDto request)
    {
        var review = await _mediator.Send(new AddRestaurantReviewCommand(
            restaurantId,
            request.Rating,
            request.Description));

        var response = new AddRestaurantReviewResponseDto
        {
            Id = review.Id,
            RestaurantId = review.RestaurantId,
            Rating = review.Rating,
            Description = review.Description,
            CreatedAt = review.CreatedAt
        };

        return Created(string.Empty, response);
    }

    [HttpDelete("{reviewId:Guid}")]
    [Authorize]
    public async Task<IActionResult> DeleteReview(Guid restaurantId, Guid reviewId)
    {
        await _mediator.Send(new DeleteRestaurantReviewCommand(restaurantId, reviewId));
        return NoContent();
    }
}
