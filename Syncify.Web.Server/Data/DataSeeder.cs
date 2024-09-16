using Microsoft.AspNetCore.Identity;
using Syncify.Web.Server.Features.Authorization;
using Syncify.Web.Server.Features.ShoppingLists;

namespace Syncify.Web.Server.Data;

public class DataSeeder(DataContext dataContext, UserManager<User> userManager, RoleManager<Role> roleManager)
{
    private readonly DataContext _dataContext = dataContext;
    private readonly UserManager<User> _userManager = userManager;
    private readonly RoleManager<Role> _roleManager = roleManager;

    private const string BasicPassword = "SuperPassword1!";

    public async Task SeedData()
    {
        await CreateRoles();
        await CreateUsers();
        await CreateShoppingItems();
    }

    private async Task CreateRoles()
    {
        if (_dataContext.Roles.Any())
            return;

        var roles = new[]
        {
            new Role { Name = Role.Admin },
            new Role { Name = Role.Member }
        };

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

        var users = new[]
        {
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
        };

        foreach (var user in users)
        {
            await _userManager.CreateAsync(user, BasicPassword);
            await _dataContext.SaveChangesAsync();
        }
    }

    private async Task CreateShoppingItems()
    {
        // Check if there are existing shopping items
        if (_dataContext.ShoppingItems.Any())
            return;

        // Create six shopping items
        var shoppingItems = new[]
        {
            new ShoppingItem { Name = "Milk", Completed = false, Checked = false },
            new ShoppingItem { Name = "Bread", Completed = false, Checked = false },
            new ShoppingItem { Name = "Eggs", Completed = false, Checked = false },
            new ShoppingItem { Name = "Butter", Completed = false, Checked = false },
            new ShoppingItem { Name = "Cheese", Completed = false, Checked = false },
            new ShoppingItem { Name = "Apples", Completed = false, Checked = false }
        };

        _dataContext.ShoppingItems.AddRange(shoppingItems);
        await _dataContext.SaveChangesAsync();
    }
}
