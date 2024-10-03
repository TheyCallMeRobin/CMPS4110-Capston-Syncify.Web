using Microsoft.AspNetCore.Mvc;
using Syncify.Common;
using Syncify.Web.Server.Features.Recipes;
using System.Security.Claims;

namespace Syncify.Web.Server.Controllers;

[ApiController]
[Route("api/recipes")]
public class RecipesController : ControllerBase
{
    private readonly IRecipeService _recipeService;

    public RecipesController(IRecipeService recipeService)
    {
        _recipeService = recipeService;
    }

    // Helper method to get the logged-in user ID
    private int GetUserId()
    {
        return int.Parse(User.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value);
    }

    [HttpGet]
    public async Task<ActionResult<Response<List<RecipeGetDto>>>> GetRecipes()
    {
        var userId = GetUserId(); // Get logged-in user ID
        var data = await _recipeService.GetRecipesByUser(userId); // Filter by user ID
        return Ok(data);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Response<RecipeGetDto>>> GetRecipeById(int id)
    {
        var data = await _recipeService.GetRecipeById(id);
        if (data.Data.UserId != GetUserId()) // Ensure the logged-in user owns the recipe
        {
            return Forbid();
        }
        return Ok(data);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    public async Task<ActionResult<Response<RecipeGetDto>>> CreateRecipe([FromBody] RecipeCreateDto dto)
    {
        var userId = GetUserId(); // Get logged-in user ID
        var data = await _recipeService.CreateRecipe(dto, userId); // Link recipe to logged-in user
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
