using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
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
    [AllowAnonymous]
    public async Task<IActionResult> GetReviews(Guid restaurantId, [FromQuery] GetRestaurantReviewsRequestDto request)
    {
        var currentUserId = User.FindFirstValue("uid") ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
        
        // Klasa DTO ma domyślne wartości, więc przekazujemy parametry bezpośrednio
        var query = new GetRestaurantReviewsQuery(
            restaurantId,
            request.PageNumber,
            request.PageSize,
            request.SortBy,
            request.SortDirection,
            request.MinRating,
            request.MaxRating);

        var result = await _mediator.Send(query);
        
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
                CreatedAt = r.CreatedAt, 
                IsOwnedByCurrentUser = !string.IsNullOrWhiteSpace(currentUserId) && r.AuthorUserId == currentUserId 
            }).ToList() 
        }; 

        return Ok(response);
    }

    [HttpPost]
    [Authorize(Roles = UserRoles.User)]
    public async Task<IActionResult> AddReview(Guid restaurantId, [FromBody] AddRestaurantReviewRequestDto request)
    {
        var command = new AddRestaurantReviewCommand(
            restaurantId,
            request.Rating,
            request.Description);

        var review = await _mediator.Send(command);

        var response = new AddRestaurantReviewResponseDto 
        { 
            Id = review.Id, 
            RestaurantId = review.RestaurantId, 
            Rating = review.Rating, 
            Description = review.Description, 
            CreatedAt = review.CreatedAt 
        };

        return CreatedAtAction(nameof(GetReviews), new { restaurantId }, response);
    }

    [HttpDelete("{reviewId:Guid}")]
    [Authorize]
    public async Task<IActionResult> DeleteReview(Guid restaurantId, Guid reviewId)
    {
        var command = new DeleteRestaurantReviewCommand(restaurantId, reviewId);
        await _mediator.Send(command);
        return NoContent();
    }
}