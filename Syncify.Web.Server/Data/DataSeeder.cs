using Bogus;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Syncify.Web.Server.Features.Authorization;
using Syncify.Web.Server.Features.CalendarEvents;
using Syncify.Web.Server.Features.Calendars;
using Syncify.Web.Server.Features.Families;
using Syncify.Web.Server.Features.Recipes;
using Syncify.Web.Server.Features.ShoppingLists;

namespace Syncify.Web.Server.Data;

public class DataSeeder
{
    private readonly DataContext _dataContext;
    private readonly UserManager<User> _userManager;
    private readonly RoleManager<Role> _roleManager;

    private readonly Faker _faker = new();
    
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
        await CreateRecipes();
        await CreateCalendars();
        await SeedFamilies();
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

        await using var transaction = await _dataContext.Database.BeginTransactionAsync();

        var userFaker = new Faker<User>()
            .RuleFor(x => x.Email, x => x.Person.Email)
            .RuleFor(x => x.PhoneNumber, x => x.Phone.PhoneNumber("##########"))
            .RuleFor(x => x.FirstName, x => x.Person.FirstName)
            .RuleFor(x => x.LastName, x => x.Person.LastName)
            .RuleFor(x => x.UserName, (x, u) => x.Internet.UserName(u.FirstName, u.LastName));
        
        User[] users =
        [
            new()
            {
                Email = "Johnjohnson@testing.com",
                FirstName = "John",
                LastName = "Johnson",
                UserName = "johnjohnson",
                PhoneNumber = _faker.Phone.PhoneNumber()
            },
            new()
            {
                Email = "janeadams@testing.com",
                FirstName = "Jane",
                LastName = "Adams",
                UserName = "janeadams",
                PhoneNumber = _faker.Phone.PhoneNumber()
            }
        ];

        users = [..users, ..userFaker.Generate(4)];
        
        try
        {
            foreach (var user in users)
            {
                var result = await _userManager.CreateAsync(user, BasicPassword);
                if (!result.Succeeded)
                {
                    var errors = result.Errors
                        .Select(x => new InvalidOperationException(x.Description));
                    throw new AggregateException(errors);
                }

                await _dataContext.SaveChangesAsync();
            }
            await transaction.CommitAsync();
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
       
    }

    //TODO: Make sure this method is functioning and then implement it 
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
                PrepTimeInSeconds = 10 * GeneralConstants.OneMinuteInSeconds,
                CookTimeInSeconds = 20 * GeneralConstants.OneMinuteInSeconds,
                Servings = 4,
                Feeds = 2,
                CreatedByUserId = john.Id
            },
            new Recipe
            {
                Name = "Jane's Salad Recipe",
                Description = "A fresh and healthy salad recipe.",
                PrepTimeInSeconds = 15 * GeneralConstants.OneMinuteInSeconds,
                Servings = 2,
                Feeds = 1,
                CreatedByUserId = jane.Id
            }
        };

        _dataContext.Set<Recipe>().AddRange(recipes);
        await _dataContext.SaveChangesAsync();
    }

    private async Task CreateCalendars()
    {
        if (_dataContext.Set<Calendar>().Any())
            return;

        var john = await _userManager.FindByNameAsync("johnjohnson");
        var jane = await _userManager.FindByNameAsync("janeadams");

        if (john is null || jane is null)
            return;

        var johnsCalendar = new Calendar
        {
            Name = "John's Calendar",
            CreatedByUserId = john.Id,
        };
        var janesCalendar = new Calendar
        {
            Name = "Jane's Calendar",
            CreatedByUserId = jane.Id
        };

        _dataContext.Set<Calendar>().AddRange(johnsCalendar, janesCalendar);
        await _dataContext.SaveChangesAsync();

        CalendarEvent[] johnsEvents =
        [
            new()
            {
                CalendarId = johnsCalendar.Id,
                Title = "Go to Timmy's Basketball game",
                CreatedByUserId = john.Id,
                StartDate = GetRandomDateOnly(),
                CalendarEventType = CalendarEventType.Event
            },
            new()
            {
                CalendarId = johnsCalendar.Id,
                Title = "Do the dishes",
                CreatedByUserId = john.Id,
                StartDate = GetRandomDateOnly(),
                CalendarEventType = CalendarEventType.Task
            },
            new()
            {
                CalendarId = johnsCalendar.Id,
                Title = "Walk the dog",
                CreatedByUserId = john.Id,
                CalendarEventType = CalendarEventType.Task
            }
        ];

        CalendarEvent[] janesEvents =
        [
            new()
            {
                CalendarId = janesCalendar.Id,
                CreatedByUserId = jane.Id,
                Title = "Go grocery shopping.",
                StartDate = GetRandomDateOnly(),
                CalendarEventType = CalendarEventType.Task
            },
            new()
            {
                CalendarId = janesCalendar.Id,
                CreatedByUserId = jane.Id,
                Title = "Dentist Appointment",
                StartDate = GetRandomDateOnly(),
                CalendarEventType = CalendarEventType.Event
            },
            new()
            {
                CalendarId = janesCalendar.Id,
                CreatedByUserId = jane.Id,
                Title = "Take Albert to Soccer practice",
                StartDate = GetRandomDateOnly(),
                CalendarEventType = CalendarEventType.Task
            }
        ];
        
        _dataContext.Set<CalendarEvent>().AddRange([..johnsEvents, ..janesEvents]);
        await _dataContext.SaveChangesAsync();
    }

    private async Task SeedFamilies()
    {
        if (await _dataContext.Set<Family>().AnyAsync())
            return;
        
        var (john, jane) = await GetSeededUsers();
        if (john is null || jane is null)
            return;

        var johnsFamily = new Family
        {
            Name = "John's Family",
            CreatedByUserId = john.Id
        };
        
        var janesFamily = new Family
        {
            Name = "Jane's Family",
            CreatedByUserId = jane.Id,
        };
        
        _dataContext.Set<Family>().AddRange(johnsFamily, janesFamily);
        await _dataContext.SaveChangesAsync();
    }
    
    private DateOnly GetRandomDateOnly()
        => DateOnly.FromDateTime(DateTime.Now.AddDays(Random.Shared.Next(1, 5)));

    private async Task<(User? john, User? jane)> GetSeededUsers()
    {
        var john = await _userManager.FindByNameAsync("johnjohnson");
        var jane = await _userManager.FindByNameAsync("janeadams");

        return (john, jane);
    }
}
