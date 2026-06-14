using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UberEats.Domain.Entities;
using UberEats.Domain.Repository;
using UberEats.Infrastructure.Databases;

namespace UberEats.Infrastructure.Repository;

public class RestaurantRepository : RepositoryBase<Restaurant>, IRestaurantRepository
{
    public RestaurantRepository(AppDbContext context) : base(context) { }

    public async Task<Restaurant?> GetWithDishesAsync(Guid id)
    {
        // FIX: Dodajemy Include również dla Address i Reviews! 
        return await _set
            .Include(r => r.Address)
            .Include(r => r.Dishes)
            .Include(r => r.Reviews)
            .FirstOrDefaultAsync(r => r.Id == id);
    }

    public async Task<bool> AnyAsync()
    {
        return await _set.AnyAsync();
    }

    // ZABEZPIECZENIE: Czasami kontrolery (lub MediatR) wywołują standardowe GetByIdAsync 
    // zdefiniowane w RepositoryBase, zamiast GetWithDishesAsync.
    // Nadpisujemy tę metodę z klasy bazowej (słowem kluczowym 'new' lub 'override', 
    // w zależności jak masz w bazie), by mieć pewność, że ZAWSZE zwrócą się dania i opinie.
    public new async Task<Restaurant?> GetByIdAsync(Guid id)
    {
        return await _set
            .Include(r => r.Address)
            .Include(r => r.Dishes)
            .Include(r => r.Reviews)
            .FirstOrDefaultAsync(r => r.Id == id);
    }
}