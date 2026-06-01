using MediatR;
using Microsoft.AspNetCore.Mvc;
using UberEats.Application.Orders.CreateOrder;
using UberEats.Application.Orders.GetOrderById;
using UberEats.WebApi.Features.Orders.OrderDTOs;

namespace UberEats.WebApi.Features.Orders;

[ApiController]
[Route("api/orders")]
public class OrdersController : ControllerBase
{
    private readonly IMediator _mediator;

    public OrdersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("{id:Guid}")]
    public async Task<IActionResult> GetOrderById(Guid id)
    {
        var result = await _mediator.Send(new GetOrderByIdQuery(id));
        var entity = result.Order;

        var resultDto = new GetOrderByIdResultDto
        {
            Id = entity.Id,
            Notes = entity.Notes,
            Date = entity.Date,
            DeliveryTime = entity.DeliveryTime,
            OrderStatus = entity.OrderStatus,
            TotalAmount = entity.TotalAmount,
            CustomerId = entity.CustomerId,
            RestaurantId = entity.RestaurantId,
            DriverId = entity.DriverId,
            Address = entity.Address != null ? new OrderAddressDto
            {
                Street = entity.Address.Street,
                City = entity.Address.City,
                BuildingNumber = entity.Address.BuildingNumber,
                AppartmentNumber = entity.Address.AppartmentNumber
            } : null,
            Driver = entity.Driver != null ? new OrderDriverDto
            {
                Name = entity.Driver.Name,
                Surname = entity.Driver.Surname,
                PhoneNumber = entity.Driver.PhoneNumber
            } : null,
            Items = entity.Items.Select(i => new OrderItemDto
            {
                Id = i.Id,
                DishNameAtPurchase = i.DishNameAtPurchase,
                PriceAtPurchase = i.PriceAtPurchase,
                Quantity = i.Quantity,
                DishId = i.DishId
            }).ToList()
        };

        return Ok(resultDto);
    }

    [HttpPost]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }
}
