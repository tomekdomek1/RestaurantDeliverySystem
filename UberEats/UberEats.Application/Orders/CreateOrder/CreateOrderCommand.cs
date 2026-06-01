using MediatR;

namespace UberEats.Application.Orders.CreateOrder;

public record CreateOrderCommand() : IRequest<Guid>;
