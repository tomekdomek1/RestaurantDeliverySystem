using Microsoft.AspNetCore.Identity;
namespace UberEats.Domain.Entities;

public class ApplicationUser : IdentityUser
{
    public string FullName { get; set; } = string.Empty;
}