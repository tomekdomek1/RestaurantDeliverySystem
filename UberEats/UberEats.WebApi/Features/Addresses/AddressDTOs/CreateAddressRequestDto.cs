namespace UberEats.WebApi.Features.Addresses.AddressDTOs;

public class CreateAddressRequestDto
{
    public string Street { get; set; } = string.Empty;
    public int BuildingNumber { get; set; }
    public int AppartmentNumber { get; set; }
    public string City { get; set; } = string.Empty;
}
