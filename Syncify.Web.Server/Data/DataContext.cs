using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Syncify.Web.Server.Features.Authorization;

namespace Syncify.Web.Server.Data;

public class DataContext : IdentityDbContext<User, Role, int, IdentityUserClaim<int>, UserRole, IdentityUserLogin<int>, IdentityRoleClaim<int>, IdentityUserToken<int>>
{
    public DbSet<ProfileColor> ProfileColors { get; set; }
    public new DbSet<UserRole> UserRoles { get; set; }

    public DataContext(DbContextOptions<DataContext> options) : base(options)
    {

    }

    public DataContext()
    {

    }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfigurationsFromAssembly(typeof(DataContext).Assembly);

    
    }
}
