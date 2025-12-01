using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UberEats.Domain.Common.Models;

namespace UberEats.Domain.Entities;

public sealed class Address : Entity<Guid>
{
    // Fields
    public string Street { get; set; } = string.Empty;
    public int BuildingNumber { get; set; }
    public int AppartmentNumber { get; set; }
    public string City { get; set; } = string.Empty;

    // References
    public ICollection<Restaurant> Restaurants { get; set; } = new List<Restaurant>();
    public ICollection<Customer> Customers { get; set; } = new List<Customer>();
    public Address(Guid id, string street, int buildingNumber, int appartmentNumber, string city) : base(id)
    {
        Street = street;
        BuildingNumber = buildingNumber;
        AppartmentNumber = appartmentNumber;
        City = city;
    }
}
