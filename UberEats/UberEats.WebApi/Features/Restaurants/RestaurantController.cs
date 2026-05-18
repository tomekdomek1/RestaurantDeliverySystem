using MediatR;
using Microsoft.AspNetCore.Mvc;
using UberEats.Application.Common;
using UberEats.Application.Restaurants.CreateRestaurant;
using UberEats.Application.Restaurants.DeleteImage;
using UberEats.Application.Restaurants.DeleteRestaurant;
using UberEats.Application.Restaurants.EditRestaurant;
using UberEats.Application.Restaurants.GetRestaurantById;
using UberEats.Application.Restaurants.GetRestaurants;
using UberEats.Application.Restaurants.UploadImages;
using UberEats.Domain.Repository;
using UberEats.WebApi.Features.Restaurants.RestaurantDTOs;

namespace UberEats.WebApi.Features.Restaurants;

[Route("api/restaurants")]
[ApiController]
public class RestaurantController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IRestaurantReviewRepository _reviewRepository;

    public RestaurantController(IMediator mediator, IRestaurantReviewRepository reviewRepository)
    {
        _mediator = mediator;
        _reviewRepository = reviewRepository;
    }

    [HttpGet]
    public async Task<IActionResult> GetRestaurants()
    {
        var entities = await _mediator.Send(new GetRestaurantsQuery());
        var ratingsByRestaurantId = await _reviewRepository.GetAverageRatingsAndCountsAsync(
            entities.Select(r => r.Id),
            DateTime.UtcNow.AddMonths(-3));

        // TODO: implement pagination
        var resultDto = entities.Select(r =>
        {
            var ratingStats = ratingsByRestaurantId.GetValueOrDefault(r.Id, (AverageRating: 0m, TotalCount: 0));
            return new GetRestaurantsResultDto
            {
                Id = r.Id,
                Name = r.Name,
                PhoneNumber = r.PhoneNumber,
                Descrition = r.Descrition,
                AddressId = r.AddressId,
                AverageRating = ratingStats.AverageRating,
                TotalReviews = ratingStats.TotalCount
            };
        }).ToList();

        return Ok(resultDto);
    }

    [HttpGet("{id:Guid}")]
    public async Task<IActionResult> GetRestaurantById(Guid id)
    {
        var entity = await _mediator.Send(new GetRestaurantByIdQuery(id));

        if (entity == null)
        {
            return NotFound();
        }

        var (averageRating, totalReviews) = await _reviewRepository.GetAverageRatingAndCountAsync(id);

        var resultDto = new GetRestaurantsResultDto
        {
            Id = entity.Id,
            Name = entity.Name,
            PhoneNumber = entity.PhoneNumber,
            Descrition = entity.Descrition,
            AddressId = entity.AddressId,
            AverageRating = averageRating,
            TotalReviews = totalReviews
        };

        return Ok(resultDto);
    }

    [HttpPost]
    public async Task<IActionResult> CreateRestaurant([FromBody] CreateRestaurantRequestDto request)
    {
        if (request == null)
        {
            return BadRequest();
        }

        var command = new CreateRestaurantCommand(
            request.Name,
            request.PhoneNumber,
            request.Descrition,
            request.AddressId);

        var created = await _mediator.Send(command);

        var resultDto = new CreateRestaurantResultDto
        {
            Id = created.Id,
            Name = created.Name,
            PhoneNumber = created.PhoneNumber,
            Descrition = created.Descrition,
            AddressId = created.AddressId
        };

        // change for GetRestaurantById later or handle response differently
        return Created(string.Empty, resultDto);
    }

    [HttpPatch("{id:Guid}")]
    public async Task<IActionResult> EditRestaurant(Guid id, [FromBody] EditRestaurantRequestDto request)
    {
        if (request == null)
        {
            return BadRequest();
        }

        var command = new EditRestaurantCommand(
            id,
            request.Name,
            request.PhoneNumber,
            request.Descrition);

        var edited = await _mediator.Send(command);

        if (edited == null)
        {
            return NotFound();
        }

        var resultDto = new EditRestaurantResultDto
        {
            Id = edited.Id,
            Name = edited.Name,
            PhoneNumber = edited.PhoneNumber,
            Descrition = edited.Descrition,
            AddressId = edited.AddressId
        };

        // change for GetRestaurantById later or handle response differently
        return Created(string.Empty, resultDto);
    }

    [HttpDelete("{id:Guid}")]
    public async Task<IActionResult> DeleteRestaurant(Guid id)
    {
        var command = new DeleteRestaurantCommand(id);
        // don't know if it should return something, an 'ok' string doesn't sound too professional
        await _mediator.Send(command);

        return NoContent();
    }



    [HttpPost("{id:Guid}/images")]
    public async Task<IActionResult> UploadImages(Guid id, IFormFileCollection images)
    {
        var uploadFiles = new List<UploadFile>();

        foreach (var file in images)
        {
            uploadFiles.Add(new UploadFile(
                FileName: file.FileName,
                Content: file.OpenReadStream(),
                ContentType: file.ContentType,
                Length: file.Length
            ));
        }

        var command = new UploadImagesRestaurantCommand(id, uploadFiles);

        var result = await _mediator.Send(command);

        return Ok(result) ;
    }

    [HttpDelete("{id:Guid}/images/{imageId:guid}")]
    public async Task<IActionResult> DeleteImage(Guid id, Guid imageId)
    {

        var command = new DeleteImageRestaurantCommand(id, imageId);
        var result = await _mediator.Send(command);
        return result ? NoContent() : BadRequest();
    }

}
