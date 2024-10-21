using System.Security.Claims;

namespace Syncify.Web.Server.Extensions;

public static class UserPrincipalExtensions
{
    public static int? GetCurrentUserId(this ClaimsPrincipal claimsPrincipal)
    {
        var userIdClaimValue = claimsPrincipal.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userIdClaimValue == null)
        {
            return null;
        }
        return int.Parse(userIdClaimValue);
    }

    public static string? GetCurrentUserName(this ClaimsPrincipal claimsPrincipal)
    {
        return claimsPrincipal.Identity?.Name;
    }

}
