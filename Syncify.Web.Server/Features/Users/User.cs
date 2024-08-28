using Microsoft.AspNetCore.Identity;
using Syncify.Web.Server.Features.Authorization;

namespace Syncify.Web.Server.Features.Users;

public class User : IdentityUser<int>
{
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public virtual ICollection<UserRole> Roles { get; set; } = new List<UserRole>();
    public virtual ICollection<Recipe> Recipes { get; set; } = new List<Recipe>();
}
