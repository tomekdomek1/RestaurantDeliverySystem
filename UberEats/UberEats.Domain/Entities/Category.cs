using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UberEats.Domain.Common.Models;

namespace UberEats.Domain.Entities;

public sealed class Category : Entity<Guid>
{
    // Fields
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    // References
    public ICollection<Dish> Dishes { get; set; } = new List<Dish>();

    public Category(Guid id, string name, string description) : base(id)
    {
        Name = name; 
        Description = description;
    }
}
