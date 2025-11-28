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
    public decimal Lat {  get; set; }
    public decimal Lon { get; set; }
    public TimeOnly TimeStamp { get; set; }
    public bool IsAvailable { get; set; }
    
    // References
    public Guid DriverId { get; set; }
    public Driver Driver { get; set; } = null!;
    public DriverLocation (Guid id, decimal lat, decimal lon, TimeOnly timeStamp, bool isAvailable,
        Guid driverId) : base(id)
    {
        Lat = lat;
        Lon = lon;
        TimeStamp = timeStamp;
        IsAvailable = isAvailable;
        DriverId = driverId;
    }
}
