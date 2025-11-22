using MediatR;
using Microsoft.AspNetCore.Mvc;
using UberEats.Application.Restaurants.CreateRestaurant;
using UberEats.Application.Restaurants.GetRestaurants;
using UberEats.WebApi.Features.Restaurants.RestaurantDTOs;

namespace UberEats.WebApi.Features.Restaurants;

[ApiController]
[Route("api/restaurants")]
public class RestaurantController : ControllerBase
{
    private readonly IMediator _mediator;
    public RestaurantController(IMediator mediator)
    {
        _mediator = mediator;
    }
    [HttpGet]
    public async Task<IActionResult> GetRestaurants()
    {
        var entities = await _mediator.Send(new GetRestaurantsQuery());
        var dto = entities.Select(r => new GetRestaurantsResultDto
        {
            Id = r.Id,
            Name = r.Name,
            PhoneNumber = r.PhoneNumber,
            Descrition = r.Descrition
        }).ToList();

        return Ok(dto);
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
}
