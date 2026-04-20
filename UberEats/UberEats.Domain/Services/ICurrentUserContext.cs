namespace UberEats.Domain.Interfaces;

public interface ICurrentUserContext
{
    string? UserId { get; }
    bool IsAuthenticated { get; }
    bool IsInRole(string role);
}
