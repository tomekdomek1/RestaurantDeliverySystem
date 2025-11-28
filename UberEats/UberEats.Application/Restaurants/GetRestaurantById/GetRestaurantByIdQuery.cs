using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UberEats.Domain.Entities;

namespace UberEats.Application.Restaurants.GetRestaurantById;

public class GetRestaurantByIdQuery : IRequest<Restaurant?>
{
    public Guid Id { get; }
    public GetRestaurantByIdQuery(Guid id)
    {
        Id = id;
    }
}
