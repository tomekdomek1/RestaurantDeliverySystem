using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UberEats.Domain.Entities;

namespace UberEats.Application.Categories.GetCategoryById;

public class GetCategoryByIdQuery : IRequest<Category?>
{
    public Guid Id { get; }
    public GetCategoryByIdQuery(Guid id)
    {
        Id = id;
    }
}
