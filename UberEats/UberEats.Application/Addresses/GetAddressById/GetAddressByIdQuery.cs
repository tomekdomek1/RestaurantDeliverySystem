using MediatR;
using UberEats.Domain.Entities;
using UberEats.Domain.Repository;

namespace UberEats.Application.Addresses.GetAddressById;

public sealed record GetAddressByIdQuery(Guid Id) : IRequest<Address?>;

public class GetAddressByIdQueryHandler : IRequestHandler<GetAddressByIdQuery, Address?>
{
    private readonly IAddressRepository _addressRepository;
    public GetAddressByIdQueryHandler(IAddressRepository addressRepository)
    {
        _addressRepository = addressRepository;
    }

    public async Task<Address?> Handle(GetAddressByIdQuery request, CancellationToken cancellationToken)
    {
        return await _addressRepository.GetByIdAsync(request.Id);
    }
}
