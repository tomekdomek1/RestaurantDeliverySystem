using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UberEats.Domain.Common.Models;

namespace UberEats.Domain.Entities;

public sealed class DriverLocation : Entity<Guid>
{
    // Fields
    public decimal Lat {  get; private set; }
    public decimal Lon { get; private set; }
    public TimeOnly TimeStamp { get; private set; }
    public bool IsAvailable { get; private set; }
    
    // References
    public Guid DriverId { get; private set; }
    public Driver Driver { get; private set; } = null!;
    public DriverLocation (Guid id, decimal lat, decimal lon, TimeOnly timestamp, bool isAvailable,
        Guid driverId) : base(id)
    {
        Lat = lat;
        Lon = lon;
        TimeStamp = timestamp;
        IsAvailable = isAvailable;
        DriverId = driverId;
    }
}
