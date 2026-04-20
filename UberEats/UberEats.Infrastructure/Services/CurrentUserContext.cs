using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using UberEats.Domain.Interfaces;

namespace UberEats.Infrastructure.Services;

public sealed class CurrentUserContext : ICurrentUserContext
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserContext(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public string? UserId
    {
        get
        {
            var user = _httpContextAccessor.HttpContext?.User;
            if (user == null)
            {
                return null;
            }

            return user.FindFirstValue("uid")
                ?? user.FindFirstValue(ClaimTypes.NameIdentifier);
        }
    }

    public bool IsAuthenticated => _httpContextAccessor.HttpContext?.User?.Identity?.IsAuthenticated == true;

    public bool IsInRole(string role) => _httpContextAccessor.HttpContext?.User?.IsInRole(role) == true;
}
