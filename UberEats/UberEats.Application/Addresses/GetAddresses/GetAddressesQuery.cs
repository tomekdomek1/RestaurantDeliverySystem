using MediatR;
using UberEats.Domain.Entities;
using UberEats.Domain.Repository;

namespace UberEats.Application.Addresses.GetAddresses;

public sealed record GetAddressesQuery() : IRequest<List<Address>>;

public class GetAddressesQueryHandler : IRequestHandler<GetAddressesQuery, List<Address>>
{
    private readonly IAddressRepository _addressRepository;
    public GetAddressesQueryHandler(IAddressRepository addressRepository)
    {
        _addressRepository = addressRepository;
    }

    public async Task<List<Address>> Handle(GetAddressesQuery request, CancellationToken cancellationToken)
    {
        return await _addressRepository.GetAllAsync();
    }
}
