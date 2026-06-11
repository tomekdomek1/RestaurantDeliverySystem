using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using UberEats.Application.Orders.CreateOrder;
using UberEats.Application.Orders.GetActiveOrdersByRestaurant;
using UberEats.Application.Orders.GetMyOrders;
using UberEats.Application.Orders.GetOrderById;
using UberEats.Application.Orders.UpdateOrderStatus;
using UberEats.WebApi.Features.Orders.OrderDTOs;
using UberEats.Infrastructure.Databases;

namespace UberEats.WebApi.Features.Orders;

[Route("api/orders")]
[ApiController]
public class OrderController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly AppDbContext _dbContext;

    public OrderController(IMediator mediator, AppDbContext dbContext)
    {
        _mediator = mediator;
        _dbContext = dbContext;
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetMyOrders()
    {
        var orders = await _mediator.Send(new GetMyOrdersQuery());

        var resultDto = orders.Select(order => new GetMyOrdersResultDto
        {
            Id = order.Id,
            RestaurantId = order.RestaurantId,
            Date = order.Date,
            DeliveryTime = order.DeliveryTime,
            Notes = order.Notes,
            Status = order.OrderStatus.ToString(),
            TotalAmount = order.TotalAmount,
            Address = order.OrderAddress == null ? new OrderAddressResultDto() : new OrderAddressResultDto
            {
                Street = order.OrderAddress.Street,
                BuildingNumber = order.OrderAddress.BuildingNumber,
                AppartmentNumber = order.OrderAddress.AppartmentNumber,
                City = order.OrderAddress.City
            },
            Items = order.OrderItems.Select(item => new OrderItemResultDto
            {
                Id = item.Id, DishId = item.DishId, Name = item.DishNameAtPurchase, Price = item.PriceAtPurchase, Quantity = item.Quantity
            }).ToList()
        }).ToList();

        return Ok(resultDto);
    }

    [HttpGet("restaurant/{restaurantId:Guid}/active")]
    public async Task<IActionResult> GetActiveOrders(Guid restaurantId)
    {
        var orders = await _mediator.Send(new GetActiveOrdersByRestaurantQuery(restaurantId));
        var resultDto = orders.Select(order => new GetActiveOrdersResultDto
        {
            Id = order.Id, RestaurantId = order.RestaurantId, CustomerId = order.CustomerId, Date = order.Date,
            Status = order.OrderStatus.ToString(), TotalAmount = order.TotalAmount,
            Items = order.OrderItems.Select(item => new OrderItemResultDto
            {
                Id = item.Id, DishId = item.DishId, Name = item.DishNameAtPurchase, Price = item.PriceAtPurchase, Quantity = item.Quantity
            }).ToList()
        }).ToList();
        return Ok(resultDto);
    }

    [HttpGet("{id:Guid}")]
    public async Task<IActionResult> GetOrderById(Guid id)
    {
        var entity = await _mediator.Send(new GetOrderByIdQuery(id));
        var resultDto = new GetOrderByIdResultDto
        {
            Id = entity.Id, Notes = entity.Notes, Date = entity.Date, DeliveryTime = entity.DeliveryTime, OrderStatus = entity.OrderStatus,
            TotalAmount = entity.TotalAmount, CustomerId = entity.CustomerId, RestaurantId = entity.RestaurantId, DriverId = entity.DriverId ?? Guid.Empty,
            Address = entity.OrderAddress != null ? new OrderAddressDto { Street = entity.OrderAddress.Street, City = entity.OrderAddress.City, BuildingNumber = entity.OrderAddress.BuildingNumber, AppartmentNumber = entity.OrderAddress.AppartmentNumber } : null,
            Driver = entity.Driver != null ? new OrderDriverDto { Name = entity.Driver.Name, Surname = entity.Driver.Surname, PhoneNumber = entity.Driver.PhoneNumber } : null,
            Items = entity.OrderItems.Select(i => new OrderItemDto { Id = i.Id, DishNameAtPurchase = i.DishNameAtPurchase, PriceAtPurchase = i.PriceAtPurchase, Quantity = i.Quantity, DishId = i.DishId }).ToList()
        };
        return Ok(resultDto);
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequestDto request)
    {
        var userIdStr = User.FindFirstValue("uid") ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdStr, out var customerId)) return Unauthorized("Brak tożsamości.");

        var customer = await _dbContext.Customers.FindAsync(customerId);
        if (customer == null) return BadRequest("Nie znaleziono klienta. Upewnij się, że Twoje konto zostało w pełni zarejestrowane.");

        var command = new CreateOrderCommand(
            customerId,
            request.RestaurantId,
            null,
            customer.AddressId,
            request.Notes,
            request.DeliveryTime,
            request.Items.Select(item => new CreateOrderItem(
                item.DishId, item.DishNameAtPurchase, item.PriceAtPurchase, item.Quantity)).ToList());

        var created = await _mediator.Send(command);
        if (created == null) return BadRequest("Błąd serwera.");

        var resultDto = new CreateOrderResponseDto
        {
            Id = created.Id, Date = created.Date, Status = created.OrderStatus.ToString(), TotalAmount = created.TotalAmount,
            Items = created.OrderItems.Select(item => new OrderItemResultDto { Id = item.Id, DishId = item.DishId, Name = item.DishNameAtPurchase, Price = item.PriceAtPurchase, Quantity = item.Quantity }).ToList()
        };

        return Created(string.Empty, resultDto);
    }

    [HttpPatch("{id:Guid}/status")]
    public async Task<IActionResult> UpdateOrderStatus(Guid id, [FromBody] UpdateOrderStatusRequestDto request)
    {
        var updated = await _mediator.Send(new UpdateOrderStatusCommand(id, request.Status));
        if (updated == null) return NotFound();
        return Created(string.Empty, new UpdateOrderStatusResponseDto { Id = updated.Id, Status = updated.OrderStatus.ToString() });
    }
}