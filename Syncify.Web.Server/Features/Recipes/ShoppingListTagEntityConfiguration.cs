using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Syncify.Web.Server.Features.Recipes
{
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
}


