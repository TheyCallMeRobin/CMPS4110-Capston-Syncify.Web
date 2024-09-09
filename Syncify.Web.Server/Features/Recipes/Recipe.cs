using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Syncify.Web.Server.Features.Authorization;

namespace Syncify.Web.Server.Features.Recipes;

public class Recipe
{
    public int Id { get; set; }           
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; } 
    public int UserId { get; set; }
    public User User { get; set; } = default!;
}

public class RecipeEntityConfiguration : IEntityTypeConfiguration<Recipe>
{
    public void Configure(EntityTypeBuilder<Recipe> builder)
    {
        builder.ToTable("Recipes");

        builder.Property(x => x.Name).HasMaxLength(128).IsRequired();
        builder.Property(x => x.Description).HasMaxLength(128).IsRequired();

        builder.HasOne(x => x.User)
            .WithMany(x => x.Recipes)
            .HasForeignKey(x => x.UserId);
    }
}