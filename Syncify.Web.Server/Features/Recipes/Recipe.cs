using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Syncify.Web.Server.Features.Authorization;
using Syncify.Web.Server.Features.FamilyRecipes;
using Syncify.Web.Server.Features.RecipeIngredients;
using Syncify.Web.Server.Features.RecipeTags;

namespace Syncify.Web.Server.Features.Recipes;

public class Recipe
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int? PrepTimeInSeconds { get; set; }
    public int? CookTimeInSeconds { get; set; }
    public int? Servings { get; set; }
    public int? Feeds { get; set; }
    public int CreatedByUserId { get; set; }
    public User CreatedByUser { get; set; } = default!;
    public List<RecipeIngredient> RecipeIngredients { get; set; } = [];
    public List<RecipeTag> RecipeTags { get; set; } = [];
    public List<FamilyRecipe> FamilyRecipes { get; set; } = [];
}

public class RecipeEntityConfiguration : IEntityTypeConfiguration<Recipe>
{
    internal const int NameMaxLength = 128;
    internal const int DescriptionMaxLength = 512;
    
    public void Configure(EntityTypeBuilder<Recipe> builder)
    {
        builder.ToTable("Recipes");

        builder.Property(x => x.Name)
            .HasMaxLength(NameMaxLength)
            .IsRequired();

        builder.Property(x => x.Description)
            .HasMaxLength(DescriptionMaxLength)
            .IsRequired(false);
        
        builder.HasOne(x => x.CreatedByUser)
            .WithMany(x => x.Recipes)
            .HasForeignKey(x => x.CreatedByUserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(x => x.RecipeTags)
            .WithOne(x => x.Recipe)
            .HasForeignKey(x => x.RecipeId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

