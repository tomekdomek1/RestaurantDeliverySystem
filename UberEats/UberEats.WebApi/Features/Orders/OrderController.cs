using MediatR;
using Microsoft.AspNetCore.Mvc;
using UberEats.Application.Orders.GetAllOrders;
using UberEats.Application.Orders.CreateOrder;

namespace UberEats.WebApi.Features.Orders
{
    [ApiController]
    [Route("api/[controller]")]
    public partial class OrdersController : ControllerBase
    {
        private readonly IMediator _mediator;

        public OrdersController(IMediator mediator)
        {
            _mediator = mediator;
        }

        // Zmieniamy na HttpGet i dodajemy jawną ścieżkę
        [HttpGet("all")]
        public async Task<IActionResult> GetMyOrders()
        {
            var query = new GetAllOrdersQuery();
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        // Wymuszamy HttpPost i dodajemy jawną ścieżkę
        [HttpPost("create")]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderCommand command)
        {
            var result = await _mediator.Send(command);
            return Ok(result);
        }
    }
}