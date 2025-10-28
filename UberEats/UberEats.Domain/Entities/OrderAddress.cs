using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UberEats.Domain.Common.Models;

namespace UberEats.Domain.Entities;

public sealed class OrderAddress : Entity<Guid>
{
    // Fields
    public string Street { get; private set; } = string.Empty;
    public int BuildingNumber { get; private set; }
    public int AppartmentNumber { get; private set; }
    public string City { get; private set; } = string.Empty;

    // References
    public Guid OrderId { get; private set; }
    public Order Order { get; private set; } = null!;
    public OrderAddress(Guid id, string street, int buildingNumber, int appartmentNumber, string city,
        Guid orderId) : base(id)
    {
        Street = street;
        BuildingNumber = buildingNumber;
        AppartmentNumber = appartmentNumber;
        City = city;
        OrderId = orderId;
    }
}
