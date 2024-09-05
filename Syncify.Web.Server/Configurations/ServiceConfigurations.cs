using Syncify.Web.Server.Features.Calendars;
using Syncify.Web.Server.Features.Recipes;

namespace Syncify.Web.Server.Configurations;

public static class ServiceConfigurations
{

    public static void ConfigureServices(IServiceCollection services)
    {
        services.AddScoped<IRecipeService, RecipeService>();
        services.AddScoped<ICalendarService, CalendarService>();
    }
    
}