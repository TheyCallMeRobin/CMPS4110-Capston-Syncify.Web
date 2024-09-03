using Syncify.Web.Server.Features.Recipes;

namespace Syncify.Web.Server.Configurations;

public static class ServiceConfigurations
{

    public static void ConfigureServices(IServiceCollection services)
    {
        services.AddScoped<IRecipeService, RecipeService>();
    }
    
}