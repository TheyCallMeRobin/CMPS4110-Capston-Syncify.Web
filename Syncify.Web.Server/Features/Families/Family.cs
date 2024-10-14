﻿using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Syncify.Web.Server.Features.Authorization;

namespace Syncify.Web.Server.Features.Families;

public class Family
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Identifier { get; set; } = string.Empty;
    public int CreatedByUserId { get; set; }

    public User CreatedByUser { get; set; } = default!;
}

public class FamilyEntityConfiguration : IEntityTypeConfiguration<Family>
{
    internal const int NameMaxLength = 128;
    
    private const int IndentifierMaxLength = 4096;
    
    public void Configure(EntityTypeBuilder<Family> builder)
    {
        builder.ToTable("Families");

        builder
            .Property(x => x.Name)
            .HasMaxLength(NameMaxLength)
            .IsRequired();

        builder
            .Property(x => x.Identifier)
            .HasMaxLength(IndentifierMaxLength)
            .IsRequired();
        
        builder
            .HasIndex(x => x.Identifier)
            .IsUnique();
        
        builder
            .HasOne(x => x.CreatedByUser)
            .WithMany();
    }
}