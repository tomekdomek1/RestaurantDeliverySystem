using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UberEats.Domain.Entities;

namespace UberEats.Application.Categories.EditCategories;

// TODO: Test to see if mapping works with a record instead of a class, both here and with DTOs
public class EditCategoryCommand : IRequest<Category>
{
    public Guid Id { get; }
    public string? Name { get; }
    public string? Description { get; }
    public EditCategoryCommand(Guid id, string? name, string? description)
    {
        Id = id;
        Name = name;
        Description = description;
    }
}
