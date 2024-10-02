using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Syncify.Web.Server.Extensions;
using Syncify.Web.Server.Features.Authorization;

namespace Syncify.Web.Server.Controllers;

[ApiController]
[Route("api/authentication")]
public class AuthenticationController : Controller
{
    private readonly IAuthenticationService _authenticationService;

    public AuthenticationController(IAuthenticationService authenticationService)
    {
        _authenticationService = authenticationService;
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<Response<UserGetDto>>> Me()
    {
        var username = User.GetCurrentUserName();
        var response = await _authenticationService.GetCurrentUser(username ?? string.Empty);
        return Ok(response);
    }

    [HttpPost("login")]
    public async Task<ActionResult<Response<UserGetDto>>> Login(LoginDto dto)
    {
        var response = await _authenticationService.Login(dto);
        return Ok(response);
    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<ActionResult> Logout()
    {
        var response = await _authenticationService.SignOut();
        return Ok(response);
    }
}
