using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
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
            
            var address = new Address(Guid.NewGuid(), "", 0, 0, "");
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

        [HttpGet("owners")]
        [Authorize(Roles = UserRoles.Admin)]
        public async Task<IActionResult> GetRestaurantOwners()
        {
            var owners = await _userManager.GetUsersInRoleAsync(UserRoles.RestaurantOwner);
            var result = owners.Select(u => new 
            { 
                email = u.Email, 
                fullName = u.FullName ?? "Restaurator" 
            }).ToList();

            return Ok(result);
        }

        [HttpGet("customers")]
        [Authorize(Roles = UserRoles.Admin)]
        public async Task<IActionResult> GetCustomers()
        {
            var customers = await _userManager.GetUsersInRoleAsync(UserRoles.User);
            
            var result = customers.Select(u => new 
            { 
                email = u.Email, 
                fullName = u.FullName ?? "Klient" 
            }).ToList();

            return Ok(result);
        }

        [HttpPut("staff/{email}")]
        [Authorize(Roles = UserRoles.Admin)]
        public async Task<IActionResult> UpdateStaff(string email, [FromBody] UpdateStaffDto dto)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null) return NotFound("Nie znaleziono użytkownika.");

            user.FullName = dto.FullName;

            if (!string.IsNullOrEmpty(dto.Password))
            {
                var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                var passResult = await _userManager.ResetPasswordAsync(user, token, dto.Password);
                if (!passResult.Succeeded) return BadRequest(passResult.Errors);
            }

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded) return BadRequest(result.Errors);

            return Ok(new { Message = "Dane użytkownika zostały zaktualizowane." });
        }

        [HttpDelete("staff/{email}")]
        [Authorize(Roles = UserRoles.Admin)]
        public async Task<IActionResult> DeleteStaff(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null) return NotFound("Nie znaleziono użytkownika.");

            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded) return BadRequest(result.Errors);

            return Ok(new { Message = "Użytkownik został pomyślnie usunięty." });
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

        [Authorize(Roles = UserRoles.RestaurantOwner)]
        [HttpGet("me/restaurant")]
        public async Task<IActionResult> GetMyRestaurant()
        {
            var userEmail = User.FindFirstValue(ClaimTypes.Email) ?? User.FindFirstValue("email");
            if (string.IsNullOrEmpty(userEmail))
                return Unauthorized(new { Error = "Email claim not found" });

            var restaurants = await _dbContext.Restaurants.ToListAsync();
            var myRestaurant = restaurants.FirstOrDefault(r => 
                r.Descrition != null && r.Descrition.Contains($"[owner:{userEmail.ToLower()}]"));

            if (myRestaurant == null)
                return NotFound(new { Error = "No restaurant found for this owner" });

            return Ok(new { RestaurantId = myRestaurant.Id });
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

    public class UpdateStaffDto
    {
        [Required] public string FullName { get; set; } = string.Empty;
        public string? Password { get; set; }
    }
}