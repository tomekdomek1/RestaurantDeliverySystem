using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UberEats.Domain.Entities;

namespace UberEats.Application.Categories.GetCategories;

public class GetCategoriesQuery : IRequest<List<Category>>
{
}
