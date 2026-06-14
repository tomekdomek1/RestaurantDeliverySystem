using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using UberEats.Domain.Entities;
using UberEats.Domain.Roles;
using UberEats.Infrastructure.Databases;

namespace UberEats.WebApi.Features.Auth
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _configuration;
        private readonly AppDbContext _dbContext;

        public AuthController(UserManager<ApplicationUser> userManager, IConfiguration configuration, AppDbContext dbContext)
        {
            _userManager = userManager;
            _configuration = configuration;
            _dbContext = dbContext;
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> RegisterUser([FromBody] RegisterUserDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var userId = Guid.NewGuid().ToString();
            var user = new ApplicationUser { Id = userId, UserName = dto.Email, Email = dto.Email, FullName = dto.FullName, IsActive = true };
            var result = await _userManager.CreateAsync(user, dto.Password);

            if (!result.Succeeded) return BadRequest(result.Errors);

            await _userManager.AddToRoleAsync(user, UserRoles.User);

            var nameParts = dto.FullName.Split(' ');
            var name = nameParts.Length > 0 ? nameParts[0] : "Nowy";
            var surname = nameParts.Length > 1 ? nameParts[1] : "Użytkownik";
            
            var address = new Address(Guid.NewGuid(), "Uzupełnij ulicę", 1, 1, "Uzupełnij miasto");
            await _dbContext.Addresses.AddAsync(address);
            
            var customer = new Customer(Guid.Parse(userId), name, surname, dto.Email, "Brak telefonu", address.Id);
            await _dbContext.Customers.AddAsync(customer);
            await _dbContext.SaveChangesAsync();

            var token = await GenerateJwtToken(user);
            SetJwtCookie(token);
            var roles = await _userManager.GetRolesAsync(user);
            var isProduction = _configuration.GetValue<bool>("IsProduction");

            return Ok(new
            {
                Message = "User registered successfully",
                Token = isProduction ? null : token,
                User = new { Id = user.Id, Email = user.Email, FullName = user.FullName, Roles = roles }
            });
        }

        [HttpPost("register-staff")]
        [Authorize(Roles = UserRoles.Admin)]
        public async Task<IActionResult> RegisterStaff([FromBody] RegisterStaffDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var validRoles = new[] { UserRoles.RestaurantOwner, UserRoles.Deliverer, UserRoles.Admin };
            if (!validRoles.Contains(dto.Role)) return BadRequest("Invalid role selected");

            var user = new ApplicationUser { UserName = dto.Email, Email = dto.Email, FullName = dto.FullName, IsActive = true };
            var result = await _userManager.CreateAsync(user, dto.Password);

            if (!result.Succeeded) return BadRequest(result.Errors);
            await _userManager.AddToRoleAsync(user, dto.Role);

            return Ok(new { Message = $"Staff member registered as {dto.Role}" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null || !await _userManager.CheckPasswordAsync(user, dto.Password))
                return Unauthorized(new { Error = "Invalid credentials" });
            
            if (!user.IsActive) return Unauthorized(new { Error = "Account is inactive." });

            var token = await GenerateJwtToken(user);
            SetJwtCookie(token);
            var roles = await _userManager.GetRolesAsync(user);
            var isProduction = _configuration.GetValue<bool>("IsProduction");

            return Ok(new
            {
                Message = "Login successful",
                Token = isProduction ? null : token,
                User = new { Id = user.Id, Email = user.Email, FullName = user.FullName, Roles = roles }
            });
        }

        [HttpPost("logout")]
        [Authorize]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("auth_token", GetCookieOptions(isLogout: true));
            return Ok(new { Message = "Logged out successfully" });
        }

        private async Task<string> GenerateJwtToken(ApplicationUser user)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"] ?? throw new InvalidOperationException("JWT Key error")));
            var userRoles = await _userManager.GetRolesAsync(user);
            var claims = new List<Claim>
            {
                // Zabezpieczenie przed nullem, którego krzyczał kompilator (CS8604)
                new Claim(JwtRegisteredClaimNames.Sub, user.Email ?? string.Empty),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim("uid", user.Id)
            };

            foreach (var role in userRoles) claims.Add(new Claim(ClaimTypes.Role, role));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(issuer: jwtSettings["Issuer"], audience: jwtSettings["Audience"], claims: claims, expires: DateTime.UtcNow.AddHours(1), signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private void SetJwtCookie(string token)
        {
            Response.Cookies.Append("auth_token", token, GetCookieOptions());
        }

        private Microsoft.AspNetCore.Http.CookieOptions GetCookieOptions(bool isLogout = false)
        {
            var isProduction = _configuration.GetValue<bool?>("IsProduction") ?? true;
            var isHttps = Request.Scheme == "https";
            var useSecure = isHttps || isProduction;
            
            return new Microsoft.AspNetCore.Http.CookieOptions
            {
                HttpOnly = true,
                Secure = useSecure,
                SameSite = useSecure ? Microsoft.AspNetCore.Http.SameSiteMode.None : Microsoft.AspNetCore.Http.SameSiteMode.Lax,
                Path = "/",
                Expires = isLogout ? DateTime.UtcNow.AddHours(-1) : DateTime.UtcNow.AddHours(1)
            };
        }
    }

    // Inicjalizowanie wartości string.Empty dla klas DTO usuwa ostrzeżenia C# o nullach (CS8618)
    public class RegisterUserDto
    {
        [Required, EmailAddress] public string Email { get; set; } = string.Empty;
        [Required, MinLength(6)] public string Password { get; set; } = string.Empty;
        [Required] public string FullName { get; set; } = string.Empty;
    }

    public class RegisterStaffDto : RegisterUserDto
    {
        [Required] public string Role { get; set; } = string.Empty;
    }

    public class LoginDto
    {
        [Required, EmailAddress] public string Email { get; set; } = string.Empty;
        [Required] public string Password { get; set; } = string.Empty;
    }
}