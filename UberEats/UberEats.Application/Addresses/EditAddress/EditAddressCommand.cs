using MediatR;
using UberEats.Domain.Entities;
using UberEats.Domain.Repository;

namespace UberEats.Application.Addresses.EditAddress;

public sealed record EditAddressCommand(
    Guid Id,
    string? Street,
    int? BuildingNumber,
    int? AppartmentNumber,
    string? City) : IRequest<Address?>;

public class EditAddressCommandHandler : IRequestHandler<EditAddressCommand, Address?>
{
    private readonly IAddressRepository _addressRepository;
    public EditAddressCommandHandler(IAddressRepository addressRepository)
    {
        _addressRepository = addressRepository;
    }

    public async Task<Address?> Handle(EditAddressCommand request, CancellationToken cancellationToken)
    {
        var addressToUpdate = await _addressRepository.GetByIdAsync(request.Id);

        if (addressToUpdate == null)
        {
            return null;
        }

        if (request.Street != null)
        {
            addressToUpdate.Street = request.Street;
        }

        if (request.BuildingNumber.HasValue)
        {
            addressToUpdate.BuildingNumber = request.BuildingNumber.Value;
        }

        if (request.AppartmentNumber.HasValue)
        {
            addressToUpdate.AppartmentNumber = request.AppartmentNumber.Value;
        }

        if (request.City != null)
        {
            addressToUpdate.City = request.City;
        }

        await _addressRepository.SaveChangesAsync();

        return addressToUpdate;
    }
}
