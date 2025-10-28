using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UberEats.Domain.Common.Models;

namespace UberEats.Domain.Entities;

public sealed class Driver : Entity<Guid>
{
    // Fields
    public string Name { get; private set; } = string.Empty;
    public string Surname { get; private set; } = string.Empty;
    public string PhoneNumber { get; private set; } = string.Empty;
    // References
    public ICollection<DriverShift> DriverShifts { get; private set; } = new List<DriverShift>();
    public DriverLocation? DriverLocation { get; private set; } // Nullable because we remove a DriverLocation of an off-duty Driver

    public Driver(Guid id, string name, string surname, string phonenumber) : base(id)
    {
        Name = name;
        Surname = surname;
        PhoneNumber = phonenumber;
    }
}
