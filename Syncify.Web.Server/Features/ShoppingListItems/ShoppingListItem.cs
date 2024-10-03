using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Syncify.Web.Server.Features.Authorization;
using Syncify.Web.Server.Features.ShoppingLists;

namespace Syncify.Web.Server.Features.ShoppingListItems;

public class ShoppingListItem
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public bool Checked { get; set; }
    public int UserId { get; set; }
    public User User { get; set; } = default!;

    public int ShoppingListId { get; set; }
    public ShoppingList ShoppingList { get; set; } = default!;
}

    public class ShoppingListItemEntityConfiguration : IEntityTypeConfiguration<ShoppingListItem>
    {
        public void Configure(EntityTypeBuilder<ShoppingListItem> builder)
        {
            builder.ToTable("ShoppingListItems");

            builder.Property(x => x.Name).HasMaxLength(128).IsRequired();
            builder.Property(x => x.Checked);

            builder.HasOne(x => x.ShoppingList)
                .WithMany(x => x.ShoppingListItems)
                .HasForeignKey(x => x.ShoppingListId);
        }
    }

