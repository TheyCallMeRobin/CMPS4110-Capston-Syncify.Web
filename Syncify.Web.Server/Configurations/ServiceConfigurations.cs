using Syncify.Web.Server.Features.Authorization;
using Syncify.Web.Server.Features.CalendarEvents;
using Syncify.Web.Server.Features.Calendars;
using Syncify.Web.Server.Features.Families;
using Syncify.Web.Server.Features.FamilyCalendars;
using Syncify.Web.Server.Features.FamilyInvites;
using Syncify.Web.Server.Features.FamilyMembers;
using Syncify.Web.Server.Features.FamilyRecipes;
using Syncify.Web.Server.Features.FamilyShoppingLists;
using Syncify.Web.Server.Features.RecipeIngredients;
using Syncify.Web.Server.Features.Recipes;
using Syncify.Web.Server.Features.ShoppingLists;
using Syncify.Web.Server.Features.ShoppingListItems;

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
        services.AddScoped<IShoppingListService, ShoppingListService>();
        services.AddScoped<IShoppingListItemService, ShoppingListItemService>();
        services.AddScoped<IFamilyService, FamilyService>();
        services.AddScoped<IFamilyCalendarService, FamilyCalendarService>();
        services.AddScoped<IFamilyRecipeService, FamilyRecipeService>();
        services.AddScoped<IFamilyShoppingListService, FamilyShoppingListService>();
        services.AddScoped<IFamilyMemberService, FamilyMemberService>();
        services.AddScoped<IFamilyInviteService, FamilyInviteService>();
    }
}