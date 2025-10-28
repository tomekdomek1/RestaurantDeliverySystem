using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UberEats.Domain.Common.Models;

namespace UberEats.Domain.Entities;

public sealed class Customer : Entity<Guid>
{
    // Fields
    public string Name { get; private set; } = string.Empty;
    public string Surname { get; private set; } = string.Empty;
    public string Email { get; private set; } = string.Empty;
    public string PhoneNumber { get; private set; } = string.Empty;

    // References
    public Guid AddressId { get; private set; }
    public Address Address { get; private set; } = null!;
    public ICollection<Order> Orders { get; private set; } = new List<Order>();
    public ICollection<ShoppingCartItem> ShoppingCartItems { get; private set; } = new List<ShoppingCartItem>();

    public Customer(Guid id, string name, string surname, string email, string phoneNumber,
        Guid addressId) : base(id)
    {
        Name = name;
        Surname = surname;
        Email = email;
        PhoneNumber = phoneNumber;
        AddressId = addressId;
    }
}
