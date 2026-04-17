using MediatR;
using UberEats.Domain.Entities;
using UberEats.Domain.Repository;

namespace UberEats.Application.Addresses.CreateAddress;

public sealed record CreateAddressCommand(
    string Street,
    int BuildingNumber,
    int AppartmentNumber,
    string City) : IRequest<Address>;

public class CreateAddressCommandHandler : IRequestHandler<CreateAddressCommand, Address>
{
    private readonly IAddressRepository _addressRepository;
    public CreateAddressCommandHandler(IAddressRepository addressRepository)
    {
        _addressRepository = addressRepository;
    }

    public async Task<Address> Handle(CreateAddressCommand request, CancellationToken cancellationToken)
    {
        var address = new Address(
            Guid.NewGuid(),
            request.Street,
            request.BuildingNumber,
            request.AppartmentNumber,
            request.City);

        await _addressRepository.AddAsync(address);
        await _addressRepository.SaveChangesAsync();

        return address;
    }
}
