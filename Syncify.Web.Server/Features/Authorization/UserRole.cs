using Microsoft.AspNetCore.Identity;
using Syncify.Web.Server.Features.Users;

namespace Syncify.Web.Server.Features.Authorization;

public class UserRole : IdentityUserRole<int>
{
    public virtual Role? Role { get; set; }
    public virtual User? User { get; set; }
    public virtual ProfileColor? ProfileColor { get; set; }

    public int ProfileColorId { get; set; }
}
