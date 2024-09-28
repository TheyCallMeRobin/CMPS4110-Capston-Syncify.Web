using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Syncify.Web.Server.Features.Authorization;
using Syncify.Web.Server.Features.ShoppingLists;

namespace Syncify.Web.Server.Features.Recipes;

public class Recipe
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;

    // Updated description to have a max length of 256 characters
    public string? Description { get; set; }

    // New properties
    public int PrepTimeInMinutes { get; set; }
    public int CookTimeInMinutes { get; set; }
    public int Servings { get; set; }

    // Foreign key to associate the recipe with a user
    public int UserId { get; set; }
    public User User { get; set; } = default!;

    // Property for tags
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

        // Updated description max length to 256 characters
        builder.Property(x => x.Description)
            .HasMaxLength(256)
            .IsRequired(false); // Optional field

        // Configuring new properties
        builder.Property(x => x.PrepTimeInMinutes)
            .IsRequired();

        builder.Property(x => x.CookTimeInMinutes)
            .IsRequired();

        builder.Property(x => x.Servings)
            .IsRequired();

        // Configuring the relationship with the User entity
        builder.HasOne(x => x.User)
            .WithMany(x => x.Recipes)
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade); // Optional: Cascade delete if the user is deleted
        // Configure the relationship with RecipeTag
        builder.HasMany(x => x.Tags)
            .WithOne(x => x.Recipe)
            .HasForeignKey(x => x.RecipeId)
            .OnDelete(DeleteBehavior.Cascade); // Optional: Cascade delete if the recipe is deleted
    }
    }

