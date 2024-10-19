using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Syncify.Web.Server.Common;
using Syncify.Web.Server.Extensions;
using Syncify.Web.Server.Features.ShoppingLists;

namespace Syncify.Web.Server.Features.ShoppingListItems;

public class ShoppingListItem
{
    public int Id { get; set; }
    public int ShoppingListId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Unit { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public bool IsChecked { get; set; }
    public ShoppingList ShoppingList { get; set; } = default!;
}

public class ShoppingListItemConfiguration : IEntityTypeConfiguration<ShoppingListItem>
{
    internal const int NameMaxLength = 128;
    internal const int DescriptionMaxLength = 2056;
    internal static readonly int UnitMaxLength = Units.List.GetLongestString().Length;
    public void Configure(EntityTypeBuilder<ShoppingListItem> builder)
    {
        builder.ToTable("ShoppingListItems");

        builder.Property(x => x.Name)
            .HasMaxLength(NameMaxLength)
            .IsRequired();

        builder.Property(x => x.Description)
            .HasMaxLength(DescriptionMaxLength)
            .IsRequired(false);

        builder.Property(x => x.Unit)
            .HasMaxLength(UnitMaxLength)
            .HasDefaultValue(Units.Count)
            .IsRequired();

        builder
            .HasOne(x => x.ShoppingList)
            .WithMany(x => x.ShoppingListItems);
    }
}