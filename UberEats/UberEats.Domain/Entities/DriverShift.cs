using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UberEats.Domain.Common.Models;

namespace UberEats.Domain.Entities;

public sealed class DriverShift : Entity<Guid>
{
    // Fields
    public DayOfWeek DayOfWeek { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }

    // References
    public Guid DriverId { get; set; }
    public Driver Driver { get; set; } = null!;
    public DriverShift(Guid id, DayOfWeek dayOfWeek, TimeOnly startTime, TimeOnly endTime,
        Guid driverId) : base(id)
    {
        DayOfWeek = dayOfWeek;
        StartTime = startTime;
        EndTime = endTime;
        DriverId = driverId;
    }
}
