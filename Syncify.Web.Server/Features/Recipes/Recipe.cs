using Syncify.Web.Server.Features.Authorization;

namespace Syncify.Web.Server.Features.Recipes
{
    public class Recipe
    {public int RecipeId { get; set; }           
    public string? RecipeName { get; set; }     
    public string? RecipeDescription { get; set; } 
    public int CreatorUserId { get; set; }   
    public int UserId { get; set; }
    public User User { get; set; }
    }
}
