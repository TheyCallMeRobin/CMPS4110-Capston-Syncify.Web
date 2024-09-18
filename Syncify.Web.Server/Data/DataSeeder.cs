using Microsoft.AspNetCore.Identity;
using Syncify.Web.Server.Features.Authorization;
using Syncify.Web.Server.Features.ShoppingLists;

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
        await CreateShoppingLists();
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

        User[] users =
        {
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
        };

        foreach (var user in users)
        {
            await _userManager.CreateAsync(user, BasicPassword);
        }

        await _dataContext.SaveChangesAsync();  // Save changes after all users are created
    }

    private async Task CreateShoppingLists()
    {
        // Check if there are existing shopping items
        if (_dataContext.ShoppingLists.Any())
            return;

        // Fetch the users to assign them to shopping items
        var john = await _userManager.FindByNameAsync("johnjohnson");
        var jane = await _userManager.FindByNameAsync("janeadams");

        if (john == null || jane == null)
            return;

        // Create six shopping items, assigning them to users
        var shoppingLists = new[]
        {
            new ShoppingList { Name = "Milk", Completed = false, Checked = false, UserId = john.Id },
            new ShoppingList { Name = "Bread", Completed = false, Checked = false, UserId = john.Id },
            new ShoppingList { Name = "Eggs", Completed = false, Checked = false, UserId = john.Id },
            new ShoppingList { Name = "Butter", Completed = false, Checked = false, UserId = jane.Id },
            new ShoppingList { Name = "Cheese", Completed = false, Checked = false, UserId = jane.Id },
            new ShoppingList { Name = "Apples", Completed = false, Checked = false, UserId = jane.Id }
        };

        _dataContext.ShoppingLists.AddRange(shoppingLists);
        await _dataContext.SaveChangesAsync();  // Save all shopping items at once
    } 
}
