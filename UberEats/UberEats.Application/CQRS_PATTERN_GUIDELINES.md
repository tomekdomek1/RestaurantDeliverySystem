# CQRS Pattern Guidelines

## 📋 Standard Pattern (NEW)

All new Commands/Queries should follow this unified pattern:

### Single File Pattern (Record + Handler)

**File Structure**:
```
Features/[Feature]/[Operation]/[Operation]Command.cs
```

**File Contents**:
```csharp
using MediatR;
using UberEats.Domain.Entities;
using UberEats.Domain.Repository;

namespace UberEats.Application.[Feature].[Operation];

// 1. Define Command as sealed record
public sealed record AddRestaurantReviewCommand(
    Guid RestaurantId,
    int Rating,
    string? Description) : IRequest<RestaurantReview>;

// 2. Define Handler in same file
public sealed class AddRestaurantReviewCommandHandler : IRequestHandler<AddRestaurantReviewCommand, RestaurantReview>
{
    private readonly IRestaurantReviewRepository _repository;

    public AddRestaurantReviewCommandHandler(IRestaurantReviewRepository repository)
    {
        _repository = repository;
    }

    public async Task<RestaurantReview> Handle(AddRestaurantReviewCommand request, CancellationToken cancellationToken)
    {
        // Implementation...
        return result;
    }
}
```

---

## ✅ Benefits of Unified Pattern

1. **Single Responsibility** - Command definition and handling logic together
2. **Easy Navigation** - Find both in one file, no context switching
3. **Less Boilerplate** - Fewer files to manage
4. **Record Immutability** - `record` enforces immutability by default
5. **Consistency** - All new features follow same approach
6. **Scalability** - Easy to extend with more records/handlers

---

## 📝 Examples

### Already Refactored (Follow This Pattern):
- ✅ `UberEats.Application/Addresses/CreateAddress/CreateAddressCommand.cs`
- ✅ `UberEats.Application/Restaurants/Reviews/AddRestaurantReview/AddRestaurantReviewCommand.cs`
- ✅ `UberEats.Application/Restaurants/Reviews/DeleteRestaurantReview/DeleteRestaurantReviewCommand.cs`
- ✅ `UberEats.Application/Restaurants/Reviews/GetRestaurantReviews/GetRestaurantReviewsQuery.cs`

### Legacy Pattern (Existing, Not Refactored Yet):
- ⚠️ `UberEats.Application/Categories/CreateCategory/` (separate files)
- ⚠️ `UberEats.Application/Restaurants/CreateRestaurant/` (separate files)

**Note**: Legacy code remains functional. New features should use the unified pattern.

---

## 🔄 For Future Refactoring

When refactoring legacy Command/Handler pairs:
1. Merge both files into single Command file
2. Convert class constructor to `sealed record`
3. Delete Handler file
4. Test thoroughly to ensure no regressions

**Estimated effort per pair**: ~5-10 minutes
**Total legacy pairs to refactor**: ~12 (future task)

---

## 📌 Decision Log

**Date**: 2026-05-03  
**Decision**: Accept current mixed pattern state  
**Reasoning**: 
- Reviews API just refactored as proof of concept
- Addresses already follows pattern
- Establishes precedent for NEW code
- Large refactor of existing code deferred for future project phase
- Focus now on testing and validation of Reviews API

**Going Forward**:
- ✅ All NEW Commands/Queries use unified pattern
- ⚠️ Existing code tolerated with documented guidelines
- 🔄 Future refactor task: Unify legacy Commands (priority: medium)

