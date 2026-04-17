using MediatR;
using Microsoft.AspNetCore.Mvc;
using UberEats.Application.Addresses.CreateAddress;
using UberEats.Application.Addresses.DeleteAddress;
using UberEats.Application.Addresses.EditAddress;
using UberEats.Application.Addresses.GetAddressById;
using UberEats.Application.Addresses.GetAddresses;
using UberEats.WebApi.Features.Addresses.AddressDTOs;

namespace UberEats.WebApi.Features.Addresses;

[Route("api/addresses")]
[ApiController]
public class AddressController : ControllerBase
{
    private readonly IMediator _mediator;
    public AddressController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetAddresses()
    {
        var entities = await _mediator.Send(new GetAddressesQuery());

        // TODO: implement pagination
        var resultDto = entities.Select(a => new GetAddressResultDto
        {
            Id = a.Id,
            Street = a.Street,
            BuildingNumber = a.BuildingNumber,
            AppartmentNumber = a.AppartmentNumber,
            City = a.City
        }).ToList();

        return Ok(resultDto);
    }

    [HttpGet("{id:Guid}")]
    public async Task<IActionResult> GetAddressById(Guid id)
    {
        var entity = await _mediator.Send(new GetAddressByIdQuery(id));

        if (entity == null)
        {
            return NotFound();
        }

        var resultDto = new GetAddressResultDto
        {
            Id = entity.Id,
            Street = entity.Street,
            BuildingNumber = entity.BuildingNumber,
            AppartmentNumber = entity.AppartmentNumber,
            City = entity.City
        };

        return Ok(resultDto);
    }

    [HttpPost]
    public async Task<IActionResult> CreateAddress([FromBody] CreateAddressRequestDto request)
    {
        if (request == null)
        {
            return BadRequest();
        }

        var command = new CreateAddressCommand(
            request.Street,
            request.BuildingNumber,
            request.AppartmentNumber,
            request.City);

        var created = await _mediator.Send(command);

        var resultDto = new CreateAddressResponseDto
        {
            Id = created.Id,
            Street = created.Street,
            BuildingNumber = created.BuildingNumber,
            AppartmentNumber = created.AppartmentNumber,
            City = created.City
        };

        return Created(string.Empty, resultDto);
    }

    [HttpPatch("{id:Guid}")]
    public async Task<IActionResult> EditAddress(Guid id, [FromBody] EditAddressRequestDto request)
    {
        if (request == null)
        {
            return BadRequest();
        }

        var command = new EditAddressCommand(
            id,
            request.Street,
            request.BuildingNumber,
            request.AppartmentNumber,
            request.City);

        var edited = await _mediator.Send(command);

        if (edited == null)
        {
            return NotFound();
        }

        var resultDto = new EditAddressResponseDto
        {
            Id = edited.Id,
            Street = edited.Street,
            BuildingNumber = edited.BuildingNumber,
            AppartmentNumber = edited.AppartmentNumber,
            City = edited.City
        };

        return Created(string.Empty, resultDto);
    }

    [HttpDelete("{id:Guid}")]
    public async Task<IActionResult> DeleteAddress(Guid id)
    {
        await _mediator.Send(new DeleteAddressCommand(id));

        return NoContent();
    }
}
