using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Syncify.Web.Server.Features.Recipes
{ 
    public class RecipeTagEntityConfiguration : IEntityTypeConfiguration<RecipeTag>
    { 
        public void Configure(EntityTypeBuilder<RecipeTag> builder)
        {
            builder.ToTable("RecipeTags");

            builder.Property(x => x.Name)
                .HasMaxLength(50)
                .IsRequired();

            // Configuring the foreign key relationship with Recipe
            builder.HasOne(x => x.Recipe)
                .WithMany(x => x.Tags)
                .HasForeignKey(x => x.RecipeId)
                .OnDelete(DeleteBehavior.Cascade); 
        }
    }
}
