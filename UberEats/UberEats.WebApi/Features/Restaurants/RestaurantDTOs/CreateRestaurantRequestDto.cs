using UberEats.Domain.Enums;

namespace UberEats.WebApi.Features.Restaurants.RestaurantDTOs;

public class CreateRestaurantRequestDto 
{
    public string Name { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string Descrition { get; set; } = string.Empty;
    public Guid AddressId { get; set; }
    public RestaurantCategory Category { get; set; }
}