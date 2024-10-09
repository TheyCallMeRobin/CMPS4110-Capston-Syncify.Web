using Syncify.Web.Server.Features.Authorization;
using Syncify.Web.Server.Features.CalendarEvents;
using Syncify.Web.Server.Features.Calendars;
using Syncify.Web.Server.Features.RecipeIngredients;
using Syncify.Web.Server.Features.Recipes;
<<<<<<< HEAD
using Syncify.Web.Server.Features.ShoppingListItems;
=======
using Syncify.Web.Server.Features.ShoppingLists;
>>>>>>> 7f79ed95fd4327e88b820bab0a321e0c010734b2

namespace Syncify.Web.Server.Configurations;

public static class ServiceConfigurations
{

    public static void ConfigureServices(IServiceCollection services)
    {
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IRecipeService, RecipeService>();
        services.AddScoped<ICalendarService, CalendarService>();
        services.AddScoped<IRecipeIngredientService, RecipeIngredientService>();
        services.AddScoped<ICalendarEventService, CalendarEventService>();
        services.AddScoped<IAuthenticationService, AuthenticationService>();
<<<<<<< HEAD
        services.AddScoped<IShoppingListItemService, ShoppingListItemService>();
=======
        services.AddScoped<IShoppingListService, ShoppingListService>();
>>>>>>> 7f79ed95fd4327e88b820bab0a321e0c010734b2
    }
    
}