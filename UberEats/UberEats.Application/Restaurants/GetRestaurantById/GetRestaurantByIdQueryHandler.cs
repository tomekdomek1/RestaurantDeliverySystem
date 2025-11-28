using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UberEats.Domain.Entities;
using UberEats.Domain.Repository;

namespace UberEats.Application.Restaurants.GetRestaurantById;

public class GetRestaurantByIdQueryHandler : IRequestHandler<GetRestaurantByIdQuery, Restaurant?>
{
    private readonly IRestaurantRepository _restaurantRepository;
    public GetRestaurantByIdQueryHandler(IRestaurantRepository restaurantRepository)
    {
        _restaurantRepository = restaurantRepository;
    }

    public async Task<Restaurant?> Handle(GetRestaurantByIdQuery request, CancellationToken cancellationToken)
    {
        return await _restaurantRepository.GetByIdAsync(request.Id);
    }
}
