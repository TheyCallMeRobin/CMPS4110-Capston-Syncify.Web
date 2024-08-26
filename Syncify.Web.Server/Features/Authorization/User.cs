using Microsoft.AspNetCore.Identity;

namespace Syncify.Web.Server.Features.Authorization;

public class User : IdentityUser<int>
{
    public virtual ICollection<UserRole> Roles { get; set; } = new List<UserRole>();
    
}
