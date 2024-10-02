using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Syncify.Web.Server.Features.Recipes;

namespace Syncify.Web.Server.Features.RecipeIngredients;

public class RecipeIngredient
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Unit { get; set; }
    public string? Description { get; set; }
    public int Quantity { get; set; }
    
    public int RecipeId { get; set; }
    public Recipe Recipe { get; set; } = default!;
}

public class RecipeIngredientEntityConfiguration : IEntityTypeConfiguration<RecipeIngredient>
{
    public const int RecipeIngredientNameMaxLength = 128;
    public void Configure(EntityTypeBuilder<RecipeIngredient> builder)
    {
        builder.ToTable("RecipeIngredients");

        builder.Property(x => x.Name).HasMaxLength(RecipeIngredientNameMaxLength);
        
        builder.HasOne(x => x.Recipe)
            .WithMany(x => x.RecipeIngredients);
    }
}