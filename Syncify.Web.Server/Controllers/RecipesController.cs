using Microsoft.AspNetCore.Mvc;
using Syncify.Web.Server.Extensions;
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

    [HttpGet]
    public async Task<ActionResult<Response<List<RecipeGetDto>>>> GetRecipes([FromQuery] RecipeQueryParams queryParams)
    {
        var userId = HttpContext.User.GetCurrentUserId() ?? 0;
        var data = await _recipeService.GetFilteredRecipes(userId, queryParams);
        return Ok(data);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Response<RecipeGetDto>>> GetRecipeById(int id)
    {
        var recipeResponse = await _recipeService.GetRecipeById(id);
        var userId = HttpContext.User.GetCurrentUserId() ?? 0;

        if (recipeResponse.Data == null)  // Check if recipe is null
        {
            return NotFound(new { message = "Recipe not found." });
        }

        // Check the UserId from the entity before it gets mapped to DTO
        if (recipeResponse.Data.UserId != userId)
        {
            return Unauthorized(new { message = "You are not authorized to view this recipe." });
        }

        return Ok(recipeResponse);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    public async Task<ActionResult<Response<RecipeGetDto>>> CreateRecipe([FromBody] RecipeCreateDto dto)
    {
        var userId = HttpContext.User.GetCurrentUserId() ?? 0;
        var data = await _recipeService.CreateRecipe(dto, userId);
        return Ok(data);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<Response<bool>>> DeleteRecipe(int id)
    {
        var recipeResponse = await _recipeService.GetRecipeById(id);
        var userId = HttpContext.User.GetCurrentUserId() ?? 0;

        if (recipeResponse.Data == null) // Check if recipe is null
        {
            return NotFound(new { message = "Recipe not found." });
        }

        if (recipeResponse.Data.UserId != userId)
        {
            return Unauthorized(new { message = "You are not authorized to delete this recipe." });
        }

        await _recipeService.DeleteRecipe(id);

        return Ok(new { success = true, message = "Recipe successfully deleted." });
    }
}
