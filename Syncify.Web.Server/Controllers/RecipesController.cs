using Microsoft.AspNetCore.Mvc;
using Syncify.Web.Server.Features.Authorization;
using Syncify.Web.Server.Features.Recipes;
using System.Security.Claims;

[ApiController]
[Route("api/recipes")]
public class RecipesController : ControllerBase
{
    private readonly IRecipeService _recipeService;

    public RecipesController(IRecipeService recipeService)
    {
        _recipeService = recipeService;
    }


    private int GetUserId()
    {
        return int.Parse(User.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value);
    }

    [HttpGet]
    public async Task<ActionResult<Response<List<RecipeGetDto>>>> GetRecipes(
        [FromQuery] string? name = null,
        [FromQuery] string? description = null,
        [FromQuery] int? prepTime = null,
        [FromQuery] int? cookTime = null,
        [FromQuery] int? servings = null)
    {
        var userId = GetUserId();
        var data = await _recipeService.GetFilteredRecipes(userId, name, description, prepTime, cookTime, servings);
        return Ok(data);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Response<RecipeGetDto>>> GetRecipeById(int id)
    {
        var data = await _recipeService.GetRecipeById(id);
        if (data.Data.UserId != GetUserId())
        {
            return Forbid();
        }
        return Ok(data);
    }

    [HttpPost]
    public async Task<ActionResult<Response<RecipeGetDto>>> CreateRecipe([FromBody] RecipeCreateDto dto)
    {
        var userId = GetUserId();
        var data = await _recipeService.CreateRecipe(dto, userId);
        return CreatedAtAction(nameof(GetRecipeById), new { id = data.Data.Id }, data);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteRecipe(int id)
    {
        var recipe = await _recipeService.GetRecipeById(id);
        if (recipe.Data.UserId != GetUserId()) // Ensure the logged-in user owns the recipe
        {
            return Forbid();
        }
        await _recipeService.DeleteRecipe(id);
        return NoContent();
    }
}
