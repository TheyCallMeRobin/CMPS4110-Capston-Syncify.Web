using Syncify.Web.Server.Features.Recipes;

namespace Syncify.Web.Server.Features.Recipes
{
    public class RecipeTag
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;

        public int RecipeId { get; set; }
        public Recipe Recipe { get; set; } = default!;
    }
}