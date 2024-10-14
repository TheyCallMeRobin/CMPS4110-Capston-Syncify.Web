using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Syncify.Web.Server.Features.Authorization;
using Syncify.Web.Server.Features.Families;
using Syncify.Web.Server.Features.ShoppingLists;

namespace Syncify.Web.Server.Features.FamilyShoppingLists;

public class FamilyShoppingList
{
    public int Id { get; set; }
    public int FamilyId { get; set; }
    public int ShoppingListId { get; set; }
    public int CreatedByUserId { get; set; }

    public Family Family { get; set; } = default!;
    public ShoppingList ShoppingList { get; set; } = default!;
    public User CreatedByUser { get; set; } = default!;
}

public class FamilyShoppingListEntityConfiguration : IEntityTypeConfiguration<FamilyShoppingList>
{
    public void Configure(EntityTypeBuilder<FamilyShoppingList> builder)
    {
        builder.ToTable("FamilyShoppingLists");

        builder
            .HasOne(x => x.Family)
            .WithMany()
            .HasForeignKey(x => x.FamilyId);

        builder
            .HasOne(x => x.ShoppingList)
            .WithMany()
            .HasForeignKey(x => x.ShoppingListId);

        builder
            .HasOne(x => x.CreatedByUser)
            .WithMany()
            .HasForeignKey(x => x.CreatedByUserId);

        builder.HasIndex(x => new { x.FamilyId, x.ShoppingListId }).IsUnique();
    }
}