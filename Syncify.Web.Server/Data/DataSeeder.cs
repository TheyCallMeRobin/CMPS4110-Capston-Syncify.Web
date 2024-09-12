using Microsoft.AspNetCore.Identity;
using Syncify.Web.Server.Features.Authorization;

namespace Syncify.Web.Server.Data;

public class DataSeeder
{
    private readonly DataContext _dataContext;
    private readonly UserManager<User> _userManager;
    private readonly RoleManager<Role> _roleManager;

    private const string BasicPassword = "SuperPassword1!";
    
    public DataSeeder(DataContext dataContext, UserManager<User> userManager, RoleManager<Role> roleManager)
    {
        _dataContext = dataContext;
        _userManager = userManager;
        _roleManager = roleManager;
    }

    public async Task SeedData()
    {
        await CreateRoles();
        await CreateUsers();
    }

    private async Task CreateRoles()
    {
        if (_dataContext.Roles.Any())
            return;
        
        Role[] roles =
        [
            new() { Name = Role.Admin },
            new() { Name = Role.Member }
        ];

        foreach (var role in roles)
        {
            await _roleManager.CreateAsync(role);
        }
        await _dataContext.SaveChangesAsync();
    }
    
    private async Task CreateUsers()
    {
        if (_dataContext.Users.Any())
            return;
        
        User[] users =
        [
            new()
            {
                Email = "Johnjohnson@testing.com",
                FirstName = "John",
                LastName = "Johnson",
                UserName = "johnjohnson",
            },
            new()
            {
                Email = "janeadams@testing.com",
                FirstName = "Jane",
                LastName = "Adams",
                UserName = "janeadams"
            }
        ];
        
        foreach (var user in users)
        {
            await _userManager.CreateAsync(user, BasicPassword);
            await _dataContext.SaveChangesAsync();
        }
    }
}