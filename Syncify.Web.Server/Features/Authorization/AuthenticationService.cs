using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Syncify.Web.Server.Extensions;

namespace Syncify.Web.Server.Features.Authorization;

public interface IAuthenticationService
{
    Task<Response<UserGetDto>> Login(LoginDto dto);
    Task<Response<UserGetDto>> GetCurrentUser(string userName);
    Task<Response> SignOut();
}

public class AuthenticationService : IAuthenticationService
{
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;

    public AuthenticationService(UserManager<User> userManager, SignInManager<User> signInManager)
    {
        _userManager = userManager;
        _signInManager = signInManager;
    }

    public async Task<Response<UserGetDto>> Login(LoginDto dto)
    {
        var error = Error.AsResponse<UserGetDto>("Username or Password is incorrect.");
        var user = await _userManager.FindByNameAsync(dto.Username);
        if (user is null)
            return error;

        var passwordResult = await _signInManager.CheckPasswordSignInAsync(user, dto.Password, false);
        if (!passwordResult.Succeeded)
            return error;

        await _signInManager.SignInAsync(user, isPersistent: false);

        return user.MapTo<UserGetDto>().AsResponse();
    }

    public async Task<Response<UserGetDto>> GetCurrentUser(string userName)
    {
        var user = await _userManager.Users
            .ProjectTo<UserGetDto>()
            .FirstOrDefaultAsync(x => x.UserName.Equals(userName));

        if (user is null)
            return Error.AsResponse<UserGetDto>("User not found", nameof(userName));

        return user.MapTo<UserGetDto>().AsResponse();
    }

    public async Task<Response> SignOut()
    {
        await _signInManager.SignOutAsync();
        return Response.Success();
    }
}