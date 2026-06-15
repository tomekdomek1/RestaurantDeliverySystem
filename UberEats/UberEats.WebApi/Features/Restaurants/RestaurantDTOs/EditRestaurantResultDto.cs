using UberEats.Domain.Enums;

namespace UberEats.WebApi.Features.Restaurants.RestaurantDTOs;

public class EditRestaurantResultDto 
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string Descrition { get; set; } = string.Empty;
    public Guid AddressId { get; set; }
    public string Category { get; set; } = string.Empty;
}