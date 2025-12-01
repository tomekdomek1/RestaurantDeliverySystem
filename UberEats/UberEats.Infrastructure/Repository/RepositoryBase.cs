using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UberEats.Domain.Common.Models;
using UberEats.Domain.Entities;
using UberEats.Domain.Repository;
using UberEats.Infrastructure.Databases;

namespace UberEats.Infrastructure.Repository;

public abstract class RepositoryBase<TEntity> : IRepository<TEntity> where TEntity : Entity<Guid>
{
    protected readonly AppDbContext _context;
    protected readonly DbSet<TEntity> _set;
    protected RepositoryBase(AppDbContext context)
    {
        _context = context;
        _set = context.Set<TEntity>();
    }

    public virtual async Task<TEntity?> GetByIdAsync(Guid id)
    {
        return await _set.FindAsync(id);
    }

    public virtual async Task<List<TEntity>> GetAllAsync()
    {
        return await _set.AsNoTracking().ToListAsync();
    }

    public virtual async Task AddAsync(TEntity entity)
    {
        await _set.AddAsync(entity);
    }

    public virtual void Update(TEntity entity)
    {
        _set.Update(entity);
    }

    public virtual async Task DeleteAsync(Guid id)
    {
        var entity = await GetByIdAsync(id);
        if (entity == null)
        {
            // will become exception
            return;
        }
        _set.Remove(entity);
    }
    public virtual async Task<bool> ExistsAsync(Guid id)
    {
        return await _set.AnyAsync(e => e.Id == id);
    }
    public virtual async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }
}
