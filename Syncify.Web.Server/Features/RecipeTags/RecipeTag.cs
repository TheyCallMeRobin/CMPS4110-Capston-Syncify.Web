using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Syncify.Web.Server.Features.Recipes;

namespace Syncify.Web.Server.Features.RecipeTags;

public class RecipeTag
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int RecipeId { get; set; }
    public Recipe Recipe { get; set; } = default!;
}

public class RecipeTagEntityConfiguration : IEntityTypeConfiguration<RecipeTag>
{
    public void Configure(EntityTypeBuilder<RecipeTag> builder)
    {
        builder.ToTable("RecipeTags");

        builder.HasKey(rt => rt.Id);

        builder.Property(rt => rt.Name)
            .HasMaxLength(50)
            .IsRequired();

        builder.HasOne(rt => rt.Recipe)
            .WithMany(r => r.Tags)
            .HasForeignKey(rt => rt.RecipeId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}