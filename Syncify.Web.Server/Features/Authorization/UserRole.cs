﻿using Microsoft.AspNetCore.Identity;

namespace Syncify.Web.Server.Features.Authorization;

public class UserRole : IdentityUserRole<int>
{
    public virtual Role? Role { get; set; }
    public virtual User? User { get; set; }
    public int ProfileColorId { get; set; }
}
