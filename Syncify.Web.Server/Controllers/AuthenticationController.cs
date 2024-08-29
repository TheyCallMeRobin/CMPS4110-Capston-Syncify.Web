using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Syncify.Web.Server.Extensions;
using Syncify.Web.Server.Features.Authorization;



namespace Syncify.Web.Server.Controllers;

[ApiController]
[Route("api/authentication")]
public class AuthenticationController : Controller
{
    private readonly SignInManager<User> _signInManager;
    private readonly UserManager<User> _userManager;

    public AuthenticationController(
        SignInManager<User> signInManager, 
        UserManager<User> userManager)
    {
        _signInManager = signInManager;
        _userManager = userManager;
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<UserDto>> Me()
    {
        var username = User.GetCurrentUserName();
        var resultDto = await GetUserDto(_userManager.Users)
            .SingleOrDefaultAsync(x => x.UserName == username);

        if (resultDto == null)
        {
            return NotFound();
        }

        return Ok(resultDto);
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto dto)
    {
        var user = await _userManager.FindByNameAsync(dto.Username);
        if (user == null)
        {
            return BadRequest();
        }
        var result = await _signInManager.CheckPasswordSignInAsync(user, dto.Password, true);
        if (!result.Succeeded)
        {
            return BadRequest();
        }

        await _signInManager.SignInAsync(user, false);

        var resultDto = await GetUserDto(_userManager.Users).SingleAsync(x => x.UserName == user.UserName);
        return Ok(resultDto);
    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<ActionResult> Logout()
    {
        await _signInManager.SignOutAsync();
        return Ok();
    }

    private static IQueryable<UserDto> GetUserDto(IQueryable<User> users)
    {
        return users.Select(x => new UserDto
        {
            Id = x.Id,
            UserName = x.UserName!,
            Roles = x.Roles.Select(y => y.Role!.Name).ToArray()!
        });
    }
}
