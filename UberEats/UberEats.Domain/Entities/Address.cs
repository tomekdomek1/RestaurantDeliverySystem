using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UberEats.Domain.Common.Models;

namespace UberEats.Domain.Entities;

public sealed class Address : Entity<Guid>
{
    public string Street { get; private set; } = string.Empty;
    public int BuildingNumber { get; private set; }
    public int AppartmentNumber { get; private set; }
    public string City { get; private set; } = string.Empty;
    public ICollection<Restaurant> Restaurants { get; private set; } = new List<Restaurant>();
    public Address(Guid id, string street, int buildingNumber, int appartmentNumber, string city) : base(id)
    {
        Street = street;
        BuildingNumber = buildingNumber;
        AppartmentNumber = appartmentNumber;
        City = city;
    }
}
