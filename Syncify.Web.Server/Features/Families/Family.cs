using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Syncify.Web.Server.Features.Authorization;
using Syncify.Web.Server.Features.FamilyMembers;

namespace Syncify.Web.Server.Features.Families;

public class Family
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public Guid Identifier { get; init; } = Guid.NewGuid();
    public int CreatedByUserId { get; set; }

    public User CreatedByUser { get; set; } = default!;
    public List<FamilyMember> FamilyMembers { get; set; } = [];
}

public class FamilyEntityConfiguration : IEntityTypeConfiguration<Family>
{
    internal const int NameMaxLength = 128;
    
    public void Configure(EntityTypeBuilder<Family> builder)
    {
        builder.ToTable("Families");

        builder
            .Property(x => x.Name)
            .HasMaxLength(NameMaxLength)
            .IsRequired();

        builder
            .Property(x => x.Identifier)
            .HasDefaultValueSql("NEWID()");

        builder.HasIndex(x => x.Identifier);
        
        builder
            .HasOne(x => x.CreatedByUser)
            .WithMany();
    }
}