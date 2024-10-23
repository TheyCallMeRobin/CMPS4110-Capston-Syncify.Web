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

    // Helper method to safely get the userId
    private int GetUserId()
    {
        var userId = HttpContext.User.GetCurrentUserId(); // GetCurrentUserId returns an int
        if (userId == 0) // Check if the userId is 0 (which might indicate an unauthenticated user)
        {
            throw new UnauthorizedAccessException("User is not authorized.");
        }
        return userId; // Directly return the userId without using .Value
    }

    [HttpGet]
    public async Task<ActionResult<Response<List<RecipeGetDto>>>> GetRecipes([FromQuery] RecipeQueryParams queryParams)
    {
        try
        {
            var userId = GetUserId();
            var data = await _recipeService.GetFilteredRecipes(userId, queryParams);
            return Ok(data);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Response<RecipeGetDto>>> GetRecipeById(int id)
    {
        try
        {
            var recipeResponse = await _recipeService.GetRecipeById(id);
            var userId = GetUserId();

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
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    public async Task<ActionResult<Response<RecipeGetDto>>> CreateRecipe([FromBody] RecipeCreateDto dto)
    {
        try
        {
            var userId = GetUserId();
            var data = await _recipeService.CreateRecipe(dto, userId);
            return Ok(data);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<Response<bool>>> DeleteRecipe(int id)
    {
        try
        {
            var recipeResponse = await _recipeService.GetRecipeById(id);
            var userId = GetUserId();

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
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }
}
