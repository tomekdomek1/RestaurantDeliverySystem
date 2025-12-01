using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UberEats.Application.Categories.DeleteCategory;

public class DeleteCategoryCommand : IRequest
{
    public Guid Id { get; }
    public DeleteCategoryCommand(Guid id)
    {
        Id = id;
    }
}
