using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Syncify.Web.Server.Features.Authorization;
using Syncify.Web.Server.Features.ShoppingLists;
using Syncify.Web.Server.Features.Recipes;
using Syncify.Web.Server.Features.RecipeIngredients;

namespace Syncify.Web.Server.Data
{
    public class DataContext : IdentityDbContext<User, Role, int, IdentityUserClaim<int>, UserRole, IdentityUserLogin<int>, IdentityRoleClaim<int>, IdentityUserToken<int>>
    {
        public DbSet<ShoppingList> ShoppingLists { get; set; }
        public DbSet<Recipe> Recipes { get; set; }  
        public DbSet<RecipeIngredient> RecipeIngredients { get; set; }  

        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfigurationsFromAssembly(typeof(DataContext).Assembly);

            modelBuilder.Entity<Recipe>()
                .HasMany(r => r.Ingredients)  
                .WithOne(ri => ri.Recipe) 
                .HasForeignKey(ri => ri.RecipeId)  
                .OnDelete(DeleteBehavior.Cascade);  
        }
    }
}
