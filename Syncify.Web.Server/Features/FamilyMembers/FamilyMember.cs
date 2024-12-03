using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Syncify.Web.Server.Features.Authorization;
using Syncify.Web.Server.Features.Families;

namespace Syncify.Web.Server.Features.FamilyMembers;

public class FamilyMember
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int FamilyId { get; set; }

    public FamilyMemberRole Role { get; set; } = FamilyMemberRole.Member;
    
    public User User { get; set; } = default!;
    public Family Family { get; set; } = default!;
}

public class FamilyMemberEntityConfiguration : IEntityTypeConfiguration<FamilyMember>
{
    public void Configure(EntityTypeBuilder<FamilyMember> builder)
    {
        builder.ToTable("FamilyMembers");

        builder.HasOne(x => x.Family)
            .WithMany(x => x.FamilyMembers)
            .HasForeignKey(x => x.FamilyId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.User)
            .WithMany()
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.ClientCascade);
    }
}