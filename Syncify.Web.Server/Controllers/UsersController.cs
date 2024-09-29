using Microsoft.AspNetCore.Mvc;
using Syncify.Web.Server.Features.Authorization;
using CreateUserDto = Syncify.Web.Server.Features.Authorization.CreateUserDto;

namespace Syncify.Web.Server.Controllers;

[ApiController]
[Route("api/users")]
public class UsersController(IUserService userService) : Controller
{
    private readonly IUserService _userService = userService;

    [HttpPost("api/createusers")]
    public async Task<ActionResult<Response<UserGetDto>>> Create(CreateUserDto createUserDto)
    {
        var data = await _userService.CreateUser(createUserDto);
        return Ok(data);
    }

    [HttpGet("id")]
    public async Task<ActionResult<Response<UserGetDto>>> GetUserById(int id)
    {
        var data = await _userService.GetById(id);
        return Ok(data);
    }
}

