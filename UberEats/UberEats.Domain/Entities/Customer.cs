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
    public string Name { get; set; } = string.Empty;
    public string Surname { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;

    // References
    public Guid AddressId { get; set; }
    public Address Address { get; set; } = null!;
    public ICollection<Order> Orders { get; set; } = new List<Order>();
    public ICollection<ShoppingCartItem> ShoppingCartItems { get; set; } = new List<ShoppingCartItem>();

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
