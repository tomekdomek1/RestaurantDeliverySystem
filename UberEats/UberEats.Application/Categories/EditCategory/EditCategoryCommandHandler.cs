using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UberEats.Application.Common;
using UberEats.Domain.Entities;
using UberEats.Domain.Repository;

namespace UberEats.Application.Categories.EditCategories;

public class EditCategoryCommandHandler : IRequestHandler<EditCategoryCommand, Category>
{
    private readonly ICategoryRepository _categoryRepository;
    public EditCategoryCommandHandler(ICategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    public async Task<Category> Handle(EditCategoryCommand request, CancellationToken cancellationToken)
    {
        var categoryToUpdate = await _categoryRepository.GetByIdAsync(request.Id);

        if (categoryToUpdate == null)
        {
            return null;
        }

        // Instead of manually updating every field we use a mapper that only updates with non null values (this is HttpPatch)
        MapObjects.Map(request, categoryToUpdate);

        await _categoryRepository.SaveChangesAsync();

        return categoryToUpdate;
    }
}
