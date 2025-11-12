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
    public string Name { get; private set; } = string.Empty;
    public string PhoneNumber { get; private set; } = string.Empty;
    public string Descrition { get; private set; } = string.Empty;

    // References
    public Guid AddressId { get; private set; }
    public Address Address { get; private set; } = null!;

    public ICollection<Dish> Dishes { get; private set; } = new List<Dish>();

    public Restaurant(Guid id, string name, string phoneNumber, string descrition,
        Guid addressId) : base(id)
    {
        Name = name;
        PhoneNumber = phoneNumber;
        Descrition = descrition;
        AddressId = addressId;
    }
}
