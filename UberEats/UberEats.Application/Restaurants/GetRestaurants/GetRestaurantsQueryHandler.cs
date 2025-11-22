using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UberEats.Domain.Entities;
using UberEats.Domain.Repository;

namespace UberEats.Application.Restaurants.GetRestaurants;

public class GetRestaurantsQueryHandler : IRequestHandler<GetRestaurantsQuery, List<Restaurant>>
{
    private readonly IRestaurantRepository _restaurantRespository;
    public GetRestaurantsQueryHandler(IRestaurantRepository restaurantRespository)
    {
        _restaurantRespository = restaurantRespository;
    }
    // mediatR requires CancellationToken for fullfilment of an interface contract even if unused
    public async Task<List<Restaurant>> Handle(GetRestaurantsQuery request, CancellationToken cancellationToken)
    {
        return await _restaurantRespository.GetAllAsync();
    }
}
