using Microsoft.AspNetCore.Identity;

namespace Syncify.Web.Server.Features.Authorization;

public class ProfileColor 
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public virtual ICollection<UserRole> Users { get; set; } = new List<UserRole>();
}
