﻿using Microsoft.AspNetCore.Identity;
using Syncify.Web.Server.Features.Authorization;
using Syncify.Web.Server.Features.Recipes;
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
        await CreateRecipes();
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

        await _dataContext.SaveChangesAsync();
    }

    private async Task CreateShoppingLists()
    {
        if (_dataContext.ShoppingLists.Any())
            return;

        var john = await _userManager.FindByNameAsync("johnjohnson");
        var jane = await _userManager.FindByNameAsync("janeadams");

        if (john == null || jane == null)
            return;

        var shoppingLists = new[]
        {
            new ShoppingList { Name = "Weekly Groceries", UserId = john.Id },
            new ShoppingList { Name = "Office Supplies", UserId = john.Id },
            new ShoppingList { Name = "Workout Gear", UserId = jane.Id },
            new ShoppingList { Name = "Books to Read", UserId = jane.Id },
        };

        _dataContext.ShoppingLists.AddRange(shoppingLists);
        await _dataContext.SaveChangesAsync();
    }

    private async Task CreateRecipes()
    {
        if (_dataContext.Set<Recipe>().Any())
            return;

        var john = await _userManager.FindByNameAsync("johnjohnson");
        var jane = await _userManager.FindByNameAsync("janeadams");

        if (john == null || jane == null)
            return;

        var recipes = new[]
        {
            new Recipe
            {
                Name = "John's Pancake Recipe",
                Description = "A simple and delicious pancake recipe.",
                PrepTimeInMinutes = 10,
                CookTimeInMinutes = 20,
                Servings = 4,
                UserId = john.Id
            },
            new Recipe
            {
                Name = "Jane's Salad Recipe",
                Description = "A fresh and healthy salad recipe.",
                PrepTimeInMinutes = 15,
                CookTimeInMinutes = 0,
                Servings = 2,
                UserId = jane.Id
            }
        };

        _dataContext.Set<Recipe>().AddRange(recipes);
        await _dataContext.SaveChangesAsync();
    }
}
