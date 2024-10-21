using System.Transactions;
using Microsoft.AspNetCore.Identity;
using Syncify.Common.Constants;
using Syncify.Web.Server.Data;
using Syncify.Web.Server.Extensions;

namespace Syncify.Web.Server.Features.Authorization;

public interface IUserService
{
    Task<Response<UserGetDto>> CreateUser(CreateUserDto dto);
    Task<Response<UserGetDto>> GetById(int id);
}

public class UserService : IUserService
{
    private readonly UserManager<User> _userManager;
    private readonly RoleManager<Role> _roleManager;
    private readonly DataContext _dataContext;
    public UserService(UserManager<User> userManager, RoleManager<Role> roleManager, DataContext dataContext)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _dataContext = dataContext;
    }

    public async Task<Response<UserGetDto>> CreateUser(CreateUserDto dto)
    {
        using var transaction = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled);
        
        var user = dto.MapTo<User>();
        var createUserResult = await CreateUserInternal(user, dto.Password);
        if (!createUserResult.Succeeded)
        {
            return new Response<UserGetDto>
            {
                Errors = createUserResult.Errors
                    .Select(x => new Error
                    {
                        ErrorMessage = x.Description
                    })
                    .ToList()
            };
        }

        if (dto.Roles.Any())
        {
            var success = await AddToRoles(user, dto.Roles);
            if (!success)
                return Error.AsResponse<UserGetDto>("One or more roles chosen does not exist.");
        }
        
        transaction.Complete();

        return user.MapTo<UserGetDto>().AsResponse();
    }

    public async Task<Response<UserGetDto>> GetById(int id)
    {
        var user = await _dataContext.Set<User>().FindAsync(id);
        if (user is null)
            return Error.AsResponse<UserGetDto>(ErrorMessages.NotFoundError);

        return user.MapTo<UserGetDto>().AsResponse();
    }

    private async Task<IdentityResult> CreateUserInternal(User user, string password)
    {
        var result = await _userManager.CreateAsync(user, password);
        return result;
    }

    private async Task<bool> AddToRoles(User user, IEnumerable<string> roles)
    {
        var roleNames = roles.ToArray();
        if (!RolesExist(roleNames))
            return false;

        await _userManager.AddToRolesAsync(user, roleNames);
        
        return true;
    }

    private bool RolesExist(IEnumerable<string> roles)
        => roles.All(name => _roleManager.Roles.Select(role => role.Name).Contains(name));
    
}