using MediatR;
using UberEats.Domain.Repository;

namespace UberEats.Application.Addresses.DeleteAddress;

public sealed record DeleteAddressCommand(Guid Id) : IRequest;

public class DeleteAddressCommandHandler : IRequestHandler<DeleteAddressCommand>
{
    private readonly IAddressRepository _addressRepository;
    public DeleteAddressCommandHandler(IAddressRepository addressRepository)
    {
        _addressRepository = addressRepository;
    }

    public async Task Handle(DeleteAddressCommand request, CancellationToken cancellationToken)
    {
        await _addressRepository.DeleteAsync(request.Id);
        await _addressRepository.SaveChangesAsync();
    }
}
