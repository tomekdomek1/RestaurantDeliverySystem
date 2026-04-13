using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using UberEats.Application.Categories.CreateCategory;
using UberEats.Application.Categories.DeleteCategory;
using UberEats.Application.Categories.EditCategories;
using UberEats.Application.Categories.GetCategories;
using UberEats.Application.Categories.GetCategoryById;
using UberEats.WebApi.Features.Categories.CategoryDTOs;

namespace UberEats.WebApi.Features.Categories;

[Route("api/categories")]
[ApiController]
public class CategoryController : ControllerBase
{
    private readonly IMediator _mediator;
    public CategoryController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetCategories()
    {
        var entities = await _mediator.Send(new GetCategoriesQuery());

        // TODO: implement pagination
        var resultDto = entities.Select(c => new GetCategoryResultDto
        {
            Id = c.Id,
            Name = c.Name,
            Description = c.Description
        }).ToList();

        return Ok(resultDto);
    }

    [HttpGet("{id:Guid}")]
    public async Task<IActionResult> GetCategoryById(Guid id)
    {
        var entity = await _mediator.Send(new GetCategoryByIdQuery(id));
        
        if (entity == null)
        {
            return NotFound();
        }

        var resultDto = new GetCategoryResultDto
        {
            Id = entity.Id,
            Name = entity.Name,
            Description = entity.Description
        };

        return Ok(resultDto);
    }

    [HttpPost]
    public async Task<IActionResult> CreateCategory([FromBody] CreateCategoryRequestDto request)
    {
        if (request == null)
        {
            return BadRequest();
        }

        var command = new CreateCategoryCommand(
            request.Name,
            request.Description);

        var created = await _mediator.Send(command);

        var resultDto = new CreateCategoryResponseDto
        {
            Id = created.Id,
            Name = created.Name,
            Description = created.Description
        };

        return Created(string.Empty, resultDto);
    }

    [HttpPatch("{id:Guid}")]
    public async Task<IActionResult> EditCategory(Guid id, [FromBody] EditCategoryRequestDto request)
    {
        if (request == null)
        {
            return BadRequest();
        }

        var command = new EditCategoryCommand(
            id, 
            request.Name, 
            request.Description);

        var edited = await _mediator.Send(command);

        if (edited == null)
        {
            return NotFound();
        }

        var resultDto = new EditCategoryResponseDto
        {
            Id = edited.Id,
            Name = edited.Name,
            Description = edited.Description
        };

        return Created(string.Empty, resultDto);
    }

    [HttpDelete("{id:Guid}")]
    public async Task<IActionResult> DeleteCategory(Guid id)
    {
        await _mediator.Send(new DeleteCategoryCommand(id));

        return NoContent();
    }
}
