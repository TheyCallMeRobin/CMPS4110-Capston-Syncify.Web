using System.ComponentModel.DataAnnotations;

namespace Syncify.Web.Server.Features.Authorization;

public class CreateUserDto
{
    [Required]
    public string UserName { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
    public List<string>? Roles { get; set; }
    public List<string>? ProfileColors { get; set; }
}
