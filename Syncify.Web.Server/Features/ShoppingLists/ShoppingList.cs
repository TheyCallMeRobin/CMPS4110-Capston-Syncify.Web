﻿using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Syncify.Web.Server.Features.Authorization;

namespace Syncify.Web.Server.Features.ShoppingLists;

public class ShoppingList
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool Checked { get; set; }
    public bool Completed { get; set; }
    public int UserId { get; set; }
    public User User { get; set; } = default!;
}

public class ShoppingListEntityConfiguration : IEntityTypeConfiguration<ShoppingList>
{
    public void Configure(EntityTypeBuilder<ShoppingList> builder)
    {
        builder.ToTable("ShoppingLists");

        builder.Property(x => x.Name).HasMaxLength(128).IsRequired();
        builder.Property(x => x.Description).HasMaxLength(128).IsRequired();

        builder.Property(x => x.Checked).IsRequired();
        builder.Property(x => x.Completed).IsRequired();

        builder.HasOne(x => x.User)
            .WithMany(x => x.ShoppingLists)
            .HasForeignKey(x => x.UserId);
    }
}
