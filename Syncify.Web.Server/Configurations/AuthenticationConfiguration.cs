using Microsoft.AspNetCore.Identity;
using Syncify.Web.Server.Data;
using Syncify.Web.Server.Features.Authorization;
using System.IdentityModel.Tokens.Jwt;

namespace Syncify.Web.Server.Configurations;

public class AuthenticationConfiguration
{
    public static void ConfigureServices(IServiceCollection services)
    {
        JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();

        services.AddIdentity<User, Role>()
            .AddEntityFrameworkStores<DataContext>()
            .AddDefaultTokenProviders();

        services.Configure<DataProtectionTokenProviderOptions>(options =>
        {
            options.TokenLifespan = TimeSpan.FromDays(2);
        });

        services.ConfigureApplicationCookie(options =>
        {
            options.ExpireTimeSpan = TimeSpan.FromDays(3);
        });

    }
}