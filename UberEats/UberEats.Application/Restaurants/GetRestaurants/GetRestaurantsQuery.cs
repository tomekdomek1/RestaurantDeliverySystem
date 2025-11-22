using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UberEats.Domain.Entities;

namespace UberEats.Application.Restaurants.GetRestaurants;

public class GetRestaurantsQuery : IRequest<List<Restaurant>>
{
}
