using Microsoft.AspNetCore.Identity;

namespace Syncify.Web.Server.Features.Authorization;

public class Role : IdentityRole<int>
{
    public const string Admin = nameof(Admin);
    public const string Member = nameof(Member);
    public const string Solo = nameof(Solo);
    public virtual ICollection<UserRole> Users { get; set; } = new List<UserRole>();
}