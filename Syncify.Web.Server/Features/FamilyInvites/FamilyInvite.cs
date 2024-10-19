using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Syncify.Web.Server.Features.Authorization;
using Syncify.Web.Server.Features.Families;

namespace Syncify.Web.Server.Features.FamilyInvites;

public class FamilyInvite
{
    public int Id { get; init; }
    public Guid Token { get; init; } = Guid.NewGuid();
    public InviteStatus Status { get; set; } = InviteStatus.Pending;
    public DateTime? ExpiresOn { get; set; }
    public DateTime CreatedOn { get; set; }
    public int FamilyId { get; set; }
    public int UserId { get; set; }
    public int SentByUserId { get; set; }
    public Family Family { get; set; } = default!;
    public User User { get; set; } = default!;
    public User SentByUser { get; set; } = default!;
}

public class FamilyInviteEntityConfiguration : IEntityTypeConfiguration<FamilyInvite>
{
    public void Configure(EntityTypeBuilder<FamilyInvite> builder)
    {
        builder.ToTable("FamilyInvites");

        builder.Property(x => x.Status).HasDefaultValue(InviteStatus.Pending);
        builder.Property(x => x.Token).HasDefaultValueSql("NEWID()");
    
        builder
            .HasOne(x => x.User)
            .WithMany()
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.ClientCascade);
        
        builder
            .HasOne(x => x.Family)
            .WithMany()
            .HasForeignKey(x => x.FamilyId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasOne(x => x.SentByUser)
            .WithMany()
            .HasForeignKey(x => x.SentByUserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(x => new { x.FamilyId, x.UserId }).IsUnique();
    }
}