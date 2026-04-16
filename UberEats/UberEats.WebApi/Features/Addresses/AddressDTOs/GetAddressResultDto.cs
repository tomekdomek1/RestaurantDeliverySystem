namespace UberEats.WebApi.Features.Addresses.AddressDTOs;

public class GetAddressResultDto
{
    public Guid Id { get; set; }
    public string Street { get; set; } = string.Empty;
    public int BuildingNumber { get; set; }
    public int AppartmentNumber { get; set; }
    public string City { get; set; } = string.Empty;
}
