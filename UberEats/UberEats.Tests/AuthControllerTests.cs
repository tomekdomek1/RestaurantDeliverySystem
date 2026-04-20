using FluentAssertions;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Moq;
using UberEats.Domain.Entities;
using UberEats.Domain.Roles;
using UberEats.WebApi.Features.Auth;
using IConfiguration = Microsoft.Extensions.Configuration.IConfiguration;

namespace UberEats.Tests;

public class AuthControllerTests
{
    private readonly Mock<UserManager<ApplicationUser>> _userManagerMock;
    private readonly Mock<IConfiguration> _configurationMock;
    private readonly AuthController _controller;

    public AuthControllerTests()
    {
        var store = new Mock<IUserStore<ApplicationUser>>();
        _userManagerMock = new Mock<UserManager<ApplicationUser>>(store.Object, null, null, null, null, null, null, null, null);
        _configurationMock = new Mock<IConfiguration>();

        _controller = new AuthController(_userManagerMock.Object, _configurationMock.Object);
    }

    [Fact]
    public async Task RegisterUser_ShouldReturnOk_WhenDataIsValid()
    {
        // Arrange
        var dto = new RegisterUserDto { Email = "test@test.com", Password = "Password123!", FullName = "Test User" };
        
        _userManagerMock.Setup(x => x.CreateAsync(It.IsAny<ApplicationUser>(), It.IsAny<string>()))
            .ReturnsAsync(IdentityResult.Success);
            
        _userManagerMock.Setup(x => x.AddToRoleAsync(It.IsAny<ApplicationUser>(), UserRoles.User))
            .ReturnsAsync(IdentityResult.Success);

        // Act
        var result = await _controller.RegisterUser(dto);

        // Assert (FluentAssertions)
        result.Should().BeOfType<OkObjectResult>();
    }

    [Fact]
    public async Task RegisterStaff_ShouldReturnBadRequest_WhenRoleIsInvalid()
    {
        // Arrange
        var dto = new RegisterStaffDto { Email = "staff@test.com", Password = "Pass", FullName = "Staff", Role = "Hacker" };

        // Act
        var result = await _controller.RegisterStaff(dto);

        // Assert (FluentAssertions)
        result.Should().BeOfType<BadRequestObjectResult>()
            .Which.Value.Should().Be("Invalid role selected");
    }
    
    [Fact]
    public async Task Login_ShouldReturnUnauthorized_WhenAccountIsInactive()
    {
        // Arrange
        var user = new ApplicationUser 
        { 
            Email = "inactive@test.com", 
            IsActive = false
        };
        var dto = new LoginDto { Email = "inactive@test.com", Password = "Password123!" };

        _userManagerMock.Setup(x => x.FindByEmailAsync(dto.Email))
            .ReturnsAsync(user);
        
        _userManagerMock.Setup(x => x.CheckPasswordAsync(user, dto.Password))
            .ReturnsAsync(true);

        // Act
        var result = await _controller.Login(dto);

        // Assert (FluentAssertions)
        // Sprawdzamy czy wynik to 401 Unauthorized ORAZ czy w treści błędu jest wzmianka o nieaktywnym koncie
        result.Should().BeOfType<UnauthorizedObjectResult>()
            .Which.Value.ToString().Should().Contain("inactive");
    }
}
