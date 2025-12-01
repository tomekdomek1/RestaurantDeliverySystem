using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UberEats.Domain.Entities;

namespace UberEats.Application.Restaurants.DeleteRestaurant;

public class DeleteRestaurantCommand : IRequest
{
    public Guid Id { get; }
    public DeleteRestaurantCommand(Guid id)
    {
        Id = id;
    }
}
