using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Syncify.Web.Server.Features.Authorization;
using Syncify.Web.Server.Features.ShoppingListItems;

namespace Syncify.Web.Server.Features.ShoppingLists;

public class ShoppingList
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int UserId { get; set; }
    public User User { get; set; } = default!;

    public List<ShoppingListItem> ShoppingListItems { get; set; } = new List<ShoppingListItem>();
}

public class ShoppingListItemEntityConfiguration : IEntityTypeConfiguration<ShoppingListItem>
{
    public void Configure(EntityTypeBuilder<ShoppingListItem> builder)
    {
        builder.ToTable("ShoppingListItems");

        builder.Property(x => x.Name).HasMaxLength(128).IsRequired();
        builder.Property(x => x.Checked).IsRequired();

        builder.HasOne(x => x.User)
            .WithMany(x => x.ShoppingListItems)
            .HasForeignKey(x => x.UserId);

        builder.HasOne(x => x.ShoppingList)
            .WithMany(x => x.ShoppingListItems)
            .HasForeignKey(x => x.ShoppingListId);
    }
}
