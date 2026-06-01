using MediatR;

namespace UberEats.Application.Orders.CreateOrder;

public class CreateOrderCommandHandler : IRequestHandler<CreateOrderCommand, Guid>
{
    public Task<Guid> Handle(CreateOrderCommand request, CancellationToken cancellationToken)
    {
        return Task.FromResult(Guid.Empty);
    }
}
