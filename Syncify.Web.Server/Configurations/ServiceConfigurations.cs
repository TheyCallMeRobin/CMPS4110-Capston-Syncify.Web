﻿using Syncify.Web.Server.Features.Authorization;
using Syncify.Web.Server.Features.CalendarEvents;
using Syncify.Web.Server.Features.Calendars;
using Syncify.Web.Server.Features.RecipeIngredients;
using Syncify.Web.Server.Features.Recipes;
using Syncify.Web.Server.Features.RecipeTags;
using Syncify.Web.Server.Features.ShoppingLists;

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
        services.AddScoped<IShoppingListService, ShoppingListService>();  // Moved from Program.cs
        services.AddScoped<IRecipeTagService, RecipeTagService>();        // Moved from Program.cs
    }
}
