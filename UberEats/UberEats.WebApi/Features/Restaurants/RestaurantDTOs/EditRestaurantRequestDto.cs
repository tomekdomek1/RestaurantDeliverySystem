using UberEats.Domain.Enums;

namespace UberEats.WebApi.Features.Restaurants.RestaurantDTOs;

public class EditRestaurantRequestDto 
{
    public string? Name { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Descrition { get; set; }
    public RestaurantCategory? Category { get; set; }
}