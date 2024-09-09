using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Syncify.Web.Server.Features.Authorization;

public class UserRoleConfiguration : IEntityTypeConfiguration<UserRole>
{
    public void Configure(EntityTypeBuilder<UserRole> builder)
    {
        builder.HasKey(x => new { x.UserId, x.RoleId });

        builder
            .HasOne(x => x.Role)
            .WithMany(x => x.Users)
            .HasForeignKey(x => x.RoleId);

        builder
            .HasOne(x => x.User)
            .WithMany(x => x.UserRoles)
            .HasForeignKey(x => x.UserId);

    }
}
