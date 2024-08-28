namespace Syncify.Web.Server.Features.Recipes
{
    public class Recipe
    {public int RecipeId { get; set; }           
    public string RecipeName { get; set; }        
    public string RecipeDescription { get; set; } 
    public int CreatorUserId { get; set; }   
       
    public Syncify.Web.Server.Features.Users.User User { get; set; }
    }
}
