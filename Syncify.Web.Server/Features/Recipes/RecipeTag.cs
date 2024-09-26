namespace Syncify.Web.Server.Features.Recipes
{
    public class RecipeTag
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;

        // Foreign key to associate the tag with a recipe
        public int RecipeId { get; set; }
        public Recipe Recipe { get; set; } = default!;
    }
}



