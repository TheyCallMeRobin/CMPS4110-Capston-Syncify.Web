using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Syncify.Web.Server.Features.Authorization;
using Syncify.Web.Server.Features.RecipeIngredients;
using Syncify.Web.Server.Features.RecipeTags;

namespace Syncify.Web.Server.Features.Recipes;

public class Recipe
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int PrepTimeInMinutes { get; set; }
    public int CookTimeInMinutes { get; set; }
    public int Servings { get; set; }
    public int UserId { get; set; }
    public User User { get; set; } = default!;

    public List<RecipeIngredient> RecipeIngredients { get; set; } = [];
    public List<RecipeTag> Tags { get; set; } = new List<RecipeTag>();
}

public class RecipeEntityConfiguration : IEntityTypeConfiguration<Recipe>
{
    public void Configure(EntityTypeBuilder<Recipe> builder)
    {
        builder.ToTable("Recipes");

        builder.Property(x => x.Name)
            .HasMaxLength(128)
            .IsRequired();

        builder.Property(x => x.Description)
            .HasMaxLength(256)
            .IsRequired(false);

        builder.Property(x => x.PrepTimeInMinutes)
            .IsRequired();

        builder.Property(x => x.CookTimeInMinutes)
            .IsRequired();

        builder.Property(x => x.Servings)
            .IsRequired();

        builder.HasOne(x => x.User)
            .WithMany(x => x.Recipes)
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(x => x.Tags)
            .WithOne(x => x.Recipe)
            .HasForeignKey(x => x.RecipeId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

