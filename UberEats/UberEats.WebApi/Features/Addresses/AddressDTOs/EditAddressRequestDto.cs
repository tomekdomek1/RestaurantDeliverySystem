namespace UberEats.WebApi.Features.Addresses.AddressDTOs;

public class EditAddressRequestDto
{
    public string? Street { get; set; }
    public int? BuildingNumber { get; set; }
    public int? AppartmentNumber { get; set; }
    public string? City { get; set; }
}
