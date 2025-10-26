using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UberEats.Domain.Common.Models;

public abstract class Entity<TId> where TId : notnull
{
    public TId Id { get; protected set; }
    protected Entity(TId id)
    {
        Id = id;
    }
}
