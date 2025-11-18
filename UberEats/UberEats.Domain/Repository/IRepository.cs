using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UberEats.Domain.Common.Models;

namespace UberEats.Domain.Repository;

public interface IRepository<TEntity> where TEntity : Entity<Guid>
{
    Task<TEntity?> GetByIdAsync(Guid id);
    Task AddAsync(TEntity entity);
    void Update(TEntity entity);
    Task DeleteAsync(Guid id);
    Task<bool> ExistsAsync(Guid id);
    Task<int> SaveChangesAsync();
}
