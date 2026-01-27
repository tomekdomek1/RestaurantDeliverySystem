using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UberEats.Domain.Common.Models;

namespace UberEats.Domain.Entities;

public sealed class Allergy :Entity<Guid>
{
    // Fields
    public string Name { get; set; } = string.Empty;

    // References
    public ICollection<Dish> Dishes { get; set; } = new List<Dish>();

    public Allergy(Guid id,  string name) : base(id)
    {
        Name = name;
    }
}
