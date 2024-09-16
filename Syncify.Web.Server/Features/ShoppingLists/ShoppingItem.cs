using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Syncify.Web.Server.Features.ShoppingLists;

public class ShoppingItem
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public bool Completed { get; set; }
    public bool Checked { get; set; }
}

public class ShoppingItemEntityConfiguration : IEntityTypeConfiguration<ShoppingItem>
{
    public void Configure(EntityTypeBuilder<ShoppingItem> builder)
    {
        builder.ToTable("ShoppingItems");
        builder.Property(x => x.Name).HasMaxLength(128).IsRequired();
    }
}
