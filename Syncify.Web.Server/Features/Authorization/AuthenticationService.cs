using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Syncify.Web.Server.Data;
using Syncify.Web.Server.Extensions;
using Syncify.Web.Server.Features.Calendars;
using Syncify.Web.Server.Helpers;

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
    private readonly IServiceProvider _serviceProvider;
    
    public AuthenticationService(UserManager<User> userManager, 
        SignInManager<User> signInManager, 
        IServiceProvider serviceProvider)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _serviceProvider = serviceProvider;
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
        
        await _signInManager.SignInAsync(user, isPersistent: true);

        _ = Task.Run(() => CreateCalendarIfNotExists(user.Id, CancellationToken.None));
        
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

    private async Task CreateCalendarIfNotExists(int userId, CancellationToken cancellationToken = default)
    {
        await using var scope = _serviceProvider.CreateAsyncScope();
        await using var dataContext = scope.ServiceProvider.GetRequiredService<DataContext>();
        
        bool hasCalendar = await dataContext
            .Set<Calendar>()
            .AnyAsync(x => x.CreatedByUserId == userId, cancellationToken);
        
        if (hasCalendar)
            return;

        var user = await dataContext.Set<User>().SingleAsync(x => x.Id == userId, cancellationToken);

        var calendarName = $"{user.FirstName}\'s Calendar";

        var newCalendar = new Calendar
        {
            Name = calendarName,
            CreatedByUserId = userId,
            DisplayColor = ColorHelpers.GenerateRandomColor(),
        };

        dataContext.Set<Calendar>().Add(newCalendar);
        await dataContext.SaveChangesAsync(cancellationToken);
    }
}