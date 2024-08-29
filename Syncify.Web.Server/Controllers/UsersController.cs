using System.Transactions;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Syncify.Web.Server.Features.Authorization;
using CreateUserDto = Syncify.Web.Server.Features.Authorization.CreateUserDto;

namespace Syncify.Web.Server.Controllers;

[ApiController]
[Route("api/users")]
public class UsersController : Controller
{
    private readonly UserManager<User> _userManager;
    private readonly RoleManager<Role> _roleManager;

    public UsersController(UserManager<User> userManager, RoleManager<Role> roleManger)
    {
        _userManager = userManager;
        _roleManager = roleManger;
    }

    [HttpPost("api/createusers")]
    public async Task<ActionResult<UserDto>> Create(CreateUserDto createUserDto)
    {
        using (var transaction = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
        {
            var newUser = new User
            {
                UserName = createUserDto.UserName,
                FirstName = createUserDto.FirstName,
                LastName = createUserDto.LastName,
                
            };

            var createResult = await _userManager.CreateAsync(newUser, createUserDto.Password);
            if (!createResult.Succeeded)
            {
                return BadRequest();
            }

            try
            {
                if (createUserDto.Roles != null && createUserDto.Roles.Any())
                {
                    foreach (var roleName in createUserDto.Roles)
                    {
                        var role = await _roleManager.FindByNameAsync(roleName);
                        if (role != null)
                        {
                            newUser.Roles.Add(new UserRole { Role = role });
                        }
                        else
                        {
                            return NotFound();
                        }
                    }

                    await _userManager.UpdateAsync(newUser);
                }
            }
            catch (InvalidOperationException e) when (e.Message.StartsWith("Role") && e.Message.EndsWith("does not exist."))
            {
                return BadRequest();
            }

            transaction.Complete();

            var userRoleNames = newUser.Roles
                .Select(role => role.Role?.Name ?? "")
                .Where(name => !string.IsNullOrWhiteSpace(name))
                .ToArray();

            return Ok(new UserDto
            {
                Id = newUser.Id,
                UserName = newUser.UserName,
                Roles = userRoleNames
               
            });
        }
    }

    [HttpGet("id")]
    public async Task<ActionResult<UserDto>> GetUserById(string id)
    {
        var user = await _userManager.FindByIdAsync(id);

        if (user == null)
        {
            return NotFound();
        }
        var isAdmin = await _userManager.IsInRoleAsync(user, Role.Admin);

        var role = isAdmin ? new string[] { "Admin" } : new string[] { "User" };

        var userDto = new UserDto
        {
            Id = user.Id,
            UserName = user.UserName ?? "Unknown",
            Roles = role
        };
        return Ok(userDto);
    }
}
