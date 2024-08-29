using Microsoft.AspNetCore.Identity;
using Syncify.Web.Server.Features.Authorization;
using Syncify.Web.Server.Features.Users;

namespace Syncify.Web.Server.Data;

public class DataSeeder
{
    private readonly DataContext _dataContext;
    private readonly UserManager<User> _userManager;
    private readonly RoleManager<Role> _roleManager;

    private const string BASIC_PASSWORD = "SuperPassword1!";
    
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
        if (!_dataContext.Roles.Any())
            return;
        
        Role[] roles =
        [
            new Role { Name = Role.Admin },
            new Role { Name = Role.Member }
        ];

        foreach (var role in roles)
        {
            await _roleManager.CreateAsync(role);
        }
        await _dataContext.SaveChangesAsync();
    }
    
    private async Task CreateUsers()
    {
        if (!_dataContext.Users.Any())
            return;
        
        User[] users =
        [
            new User
            {
                Email = "Johnjohnson@testing.com",
                FirstName = "John",
                LastName = "Johnson",
                UserName = "johnjohnson",
            },
            new User
            {
                Email = "janeadams@testing.com",
                FirstName = "Jane",
                LastName = "Adams",
                UserName = "janeadams"
            }
        ];
        
        foreach (var user in users)
        {
            await _userManager.CreateAsync(user, BASIC_PASSWORD);
            await _dataContext.SaveChangesAsync();
        }
    }
}