using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Syncify.Web.Server.Features.Authorization;
using Syncify.Web.Server.Features.Families;
using Syncify.Web.Server.Features.Recipes;

namespace Syncify.Web.Server.Features.FamilyRecipes;

public class FamilyRecipe
{
    public int Id { get; set; }
    public int FamiyId { get; set; }
    public int RecipeId { get; set; }
    public int CreatedByUserId { get; set; }

    public Family Family { get; set; } = default!;
    public Recipe Recipe { get; set; } = default!;
    public User CreatedByUser { get; set; } = default!;
}

public class FamilyRecipeEntityConfiguration : IEntityTypeConfiguration<FamilyRecipe>
{
    public void Configure(EntityTypeBuilder<FamilyRecipe> builder)
    {
        builder.ToTable("FamilyRecipes");

        builder
            .HasOne(x => x.Family)
            .WithMany()
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasOne(x => x.CreatedByUser)
            .WithMany()
            .HasForeignKey(x => x.CreatedByUserId)
            .OnDelete(DeleteBehavior.Restrict);
        
        builder
            .HasOne(x => x.Recipe)
            .WithMany()
            .HasForeignKey(x => x.RecipeId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(x => x.RecipeId).IsUnique();
    }
}