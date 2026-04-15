using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using UberEats.Application.Restaurants.Dishes.AddDishToMenu;
using UberEats.Application.Restaurants.Dishes.DeleteDish;
using UberEats.Application.Restaurants.Dishes.EditDish;
using UberEats.Application.Restaurants.Dishes.GetDishes;
using UberEats.WebApi.Features.Dishes.DishDTOs;

namespace UberEats.WebApi.Features.Dishes;

[Route("api/restaurants/{restaurantId}/dishes")]
[ApiController]
public class MenuController : ControllerBase
{
    private readonly IMediator _mediator;

    public MenuController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetDishes(Guid restaurantId)
    {
        var dishes = await _mediator.Send(new GetDishesQuery(restaurantId));

        var resultDto = dishes.Select(dish => new GetDishResultDto
        {
            Id = dish.Id,
            Name = dish.Name,
            Description = dish.Description,
            Price = dish.Price,
            CategoryId = dish.CategoryId
        });

        return Ok(resultDto);
    }

    [HttpPost]
    public async Task<IActionResult> AddDishToMenu(Guid restaurantId, [FromBody] AddDishRequestDto request)
    {
        var command = new AddDishToMenuCommand(
            request.Name,
            request.Description,
            request.Price,
            restaurantId,
            request.CategoryId);

        var dish = await _mediator.Send(command);

        var resultDto = new AddDishResponseDto
        {
            Id = dish.Id,
            Name = dish.Name,
            Description = dish.Description,
            Price = dish.Price,
            CategoryId = dish.CategoryId
        };

        return Created(nameof(AddDishToMenu), resultDto);
    }

    // TODO: Seems to delete strings that are not provided in the body of the request. It's most likely an issue with the MapObjects.Map() function.
    [HttpPatch("{dishId:Guid}")]
    public async Task<IActionResult> EditDish(Guid restaurantId, Guid dishId, [FromBody] EditDishRequestDto request)
    {
        if (request == null)
        {
            return BadRequest();
        }

        var command = new EditDishCommand(
            dishId,
            restaurantId,
            request.Name,
            request.Description,
            request.Price,
            request.CategoryId);

        var edited = await _mediator.Send(command);

        if (edited == null)
        {
            return NotFound();
        }

        var resultDto = new EditDishResponseDto
        {
            Id = edited.Id,
            Name = edited.Name,
            Description = edited.Description,
            Price = edited.Price,
            CategoryId = edited.CategoryId
        };

        return Created(string.Empty, resultDto);
    }

    [HttpDelete("{dishId:Guid}")]
    public async Task<IActionResult> DeleteDish(Guid restaurantId, Guid dishId)
    {
        await _mediator.Send(new DeleteDishCommand(dishId, restaurantId));

        return NoContent();
    }
}
