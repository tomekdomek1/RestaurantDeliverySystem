using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UberEats.Domain.Common.Models;

namespace UberEats.Domain.Entities;

public sealed class Restaurant : Entity<Guid>
{
    public string Name { get; private set; } = string.Empty;
    public string Address { get; private set; } = string.Empty;
    public string PhoneNumber { get; private set; } = string.Empty;
    public string Descrition { get; private set; } = string.Empty;

    public ICollection<Dish> Dishes { get; private set; } = new List<Dish>();

    public Restaurant(Guid id, string name, string address, string phoneNumber, string descrition) : base(id)
    {
        Name = name;
        Address = address;
        PhoneNumber = phoneNumber;
        Descrition = descrition;
    }
}
