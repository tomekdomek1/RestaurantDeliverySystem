using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UberEats.Domain.Entities;

namespace UberEats.Application.Categories.CreateCategory;

public class CreateCategoryCommand : IRequest<Category>
{
    public string Name { get; }
    public string Description { get; }
    public CreateCategoryCommand(string name, string description)
    {
        Name = name;
        Description = description;
    }
}
