using UberEats.Domain.Common.Models;

namespace UberEats.Domain.Entities;

public sealed class RestaurantReview : Entity<Guid>
{
    public Guid RestaurantId { get; set; }
    public string AuthorUserId { get; set; } = string.Empty;
    public int Rating { get; set; }
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }

    public Restaurant Restaurant { get; set; } = null!;

    public RestaurantReview(Guid id, Guid restaurantId, string authorUserId, int rating, string? description, DateTime createdAt) : base(id)
    {
        RestaurantId = restaurantId;
        AuthorUserId = authorUserId;
        Rating = rating;
        Description = description;
        CreatedAt = createdAt;
    }
}
