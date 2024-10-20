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
        var data = await _recipeService.GetFilteredRecipes(userId, queryParams.Name, queryParams.Description, queryParams.PrepTime ?? 0, queryParams.CookTime ?? 0, queryParams.Servings ?? 0);
        return Ok(data);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Response<RecipeGetDto>>> GetRecipeById(int id)
    {
        var data = await _recipeService.GetRecipeById(id);
        var userId = HttpContext.User.GetCurrentUserId() ?? 0;

        if (data.Data.UserId != userId)
        {
            return Unauthorized(new { message = "You are not authorized to view this recipe." });
        }
        return Ok(data);
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
        var recipe = await _recipeService.GetRecipeById(id);
        var userId = HttpContext.User.GetCurrentUserId() ?? 0;

        if (recipe.Data.UserId != userId)
        {
            return Unauthorized(new { message = "You are not authorized to delete this recipe." });
        }

        await _recipeService.DeleteRecipe(id);

        return Ok(new { success = true, message = "Recipe successfully deleted." });
    }


    public class RecipeQueryParams
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public int? PrepTime { get; set; }
        public int? CookTime { get; set; }
        public int? Servings { get; set; }
    }
}