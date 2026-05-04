using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UberEats.Domain.Common.Models;

namespace UberEats.Domain.Entities;

public sealed class Restaurant : Entity<Guid>
{
    // Fields
    public string Name { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string Descrition { get; set; } = string.Empty;

    // References
    public Guid AddressId { get; set; }
    public Address Address { get; set; } = null!;

    public ICollection<Dish> Dishes { get; set; } = new List<Dish>();
    public ICollection<RestaurantReview> Reviews { get; set; } = new List<RestaurantReview>();

    public Restaurant(Guid id, string name, string phoneNumber, string descrition,
        Guid addressId) : base(id)
    {
        Name = name;
        PhoneNumber = phoneNumber;
        Descrition = descrition;
        AddressId = addressId;
    }
}
