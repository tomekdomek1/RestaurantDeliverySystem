using MediatR;
using Microsoft.AspNetCore.Mvc;
using UberEats.Application.Orders.CreateOrder;
using UberEats.Application.Orders.GetActiveOrdersByRestaurant;
using UberEats.Application.Orders.UpdateOrderStatus;
using UberEats.WebApi.Features.Orders.OrderDTOs;

namespace UberEats.WebApi.Features.Orders;

[Route("api/orders")]
[ApiController]
public class OrderController : ControllerBase
{
    private readonly IMediator _mediator;

    public OrderController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("restaurant/{restaurantId:Guid}/active")]
    public async Task<IActionResult> GetActiveOrders(Guid restaurantId)
    {
        var orders = await _mediator.Send(new GetActiveOrdersByRestaurantQuery(restaurantId));

        var resultDto = orders.Select(order => new GetActiveOrdersResultDto
        {
            Id = order.Id,
            RestaurantId = order.RestaurantId,
            CustomerId = order.CustomerId,
            Date = order.Date,
            Status = order.OrderStatus.ToString(),
            TotalAmount = order.TotalAmount,
            Items = order.OrderItems.Select(item => new OrderItemResultDto
            {
                Id = item.Id,
                DishId = item.DishId,
                Name = item.DishNameAtPurchase,
                Price = item.PriceAtPurchase,
                Quantity = item.Quantity
            }).ToList()
        }).ToList();

        return Ok(resultDto);
    }

    [HttpPost]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequestDto request)
    {
        if (request == null)
        {
            return BadRequest();
        }

        var command = new CreateOrderCommand(
            request.CustomerId,
            request.RestaurantId,
            request.DriverId,
            request.AddressId,
            request.Notes,
            request.DeliveryTime,
            request.Items.Select(item => new CreateOrderItem(
                item.DishId,
                item.DishNameAtPurchase,
                item.PriceAtPurchase,
                item.Quantity)).ToList());

        var created = await _mediator.Send(command);

        if (created == null)
        {
            return NotFound();
        }

        var resultDto = new CreateOrderResponseDto
        {
            Id = created.Id,
            Date = created.Date,
            Status = created.OrderStatus.ToString(),
            TotalAmount = created.TotalAmount,
            Items = created.OrderItems.Select(item => new OrderItemResultDto
            {
                Id = item.Id,
                DishId = item.DishId,
                Name = item.DishNameAtPurchase,
                Price = item.PriceAtPurchase,
                Quantity = item.Quantity
            }).ToList()
        };

        return Created(string.Empty, resultDto);
    }

    [HttpPatch("{id:Guid}/status")]
    public async Task<IActionResult> UpdateOrderStatus(Guid id, [FromBody] UpdateOrderStatusRequestDto request)
    {
        if (request == null)
        {
            return BadRequest();
        }

        var command = new UpdateOrderStatusCommand(id, request.Status);

        var updated = await _mediator.Send(command);

        if (updated == null)
        {
            return NotFound();
        }

        var resultDto = new UpdateOrderStatusResponseDto
        {
            Id = updated.Id,
            Status = updated.OrderStatus.ToString()
        };

        return Created(string.Empty, resultDto);
    }
}