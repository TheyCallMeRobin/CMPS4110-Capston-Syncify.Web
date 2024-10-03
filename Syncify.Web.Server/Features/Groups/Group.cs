using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Syncify.Web.Server.Features.Authorization;

namespace Syncify.Web.Server.Features.Groups;

public class Group
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Identifier { get; set; } = string.Empty;
    public int CreatedByUserId { get; set; }

    public User CreatedByUser { get; set; } = default!;
}

public class GroupEntityConfiguration : IEntityTypeConfiguration<Group>
{
    internal const int NameMaxLength = 128;
    
    public void Configure(EntityTypeBuilder<Group> builder)
    {
        builder.ToTable("Groups");

        builder
            .Property(x => x.Name)
            .HasMaxLength(NameMaxLength)
            .IsRequired();
        
        builder
            .HasIndex(x => x.Identifier)
            .IsUnique();
        
        builder
            .HasOne(x => x.CreatedByUser)
            .WithMany();
    }
}