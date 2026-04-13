using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UberEats.Domain.Entities;
using UberEats.Domain.Repository;

namespace UberEats.Application.Restaurants.DeleteRestaurant;

public class DeleteRestaurantCommandHandler : IRequestHandler<DeleteRestaurantCommand>
{
    private readonly IRestaurantRepository _restaurantRepository;
    public DeleteRestaurantCommandHandler(IRestaurantRepository restaurantRepository)
    {
        _restaurantRepository = restaurantRepository;
    }
    public async Task Handle(DeleteRestaurantCommand request, CancellationToken cancellationToken)
    {
        await _restaurantRepository.DeleteAsync(request.Id);
        await _restaurantRepository.SaveChangesAsync();
    }
}
