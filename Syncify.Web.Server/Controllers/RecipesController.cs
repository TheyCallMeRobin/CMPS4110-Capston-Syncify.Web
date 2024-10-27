using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Syncify.Web.Server.Extensions;
using Syncify.Web.Server.Features.Recipes;

namespace Syncify.Web.Server.Controllers;

[ApiController]
[Authorize]
[Route("api/recipes")]
public class RecipesController : ControllerBase
{
    private readonly IRecipeService _recipeService;

    public RecipesController(IRecipeService recipeService)
    {
        _recipeService = recipeService;
    }

    [HttpGet]
    public async Task<ActionResult<Response<List<RecipeGetDto>>>> GetRecipes([FromQuery] RecipeQuery? query)
    {
        var data = await _recipeService.GetRecipes(query);
        return Ok(data);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Response<RecipeGetDto>>> GetRecipeById(int id)
    {
        var data = await _recipeService.GetRecipeById(id);
        return Ok(data);
    }

    [HttpGet("user/{userId}")]
    public async Task<ActionResult<Response<List<RecipeGetDto>>>> GetRecipesByUserId(int userId)
    {
        var data = await _recipeService.GetRecipesByUserId(userId);
        return Ok(data);
    }

    [HttpGet("recipe-of-the-day")]
    public async Task<ActionResult<Response<RecipeGetDto>>> GetRecipeOfTheDay()
    {
        var data = await _recipeService.GetRecipeOfTheDay();
        return Ok(data);
    }
    
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    public async Task<ActionResult<Response<RecipeGetDto>>> CreateRecipe([FromBody] RecipeCreateDto dto)
    {
        var data = await _recipeService.CreateRecipe(dto with
        {
            CreatedByUserId = User.GetCurrentUserId()
        });
        return Ok(data);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Response<RecipeGetDto>>> UpdateRecipe([FromRoute] int id,
        [FromBody] RecipeUpdateDto dto)
    {
        var data = await _recipeService.UpdateRecipe(dto with
        {
            Id = id
        });
        return Ok(data);
    }
    
    [HttpDelete("{id}")]
    public async Task<ActionResult<Response>> DeleteRecipe(int id)
    {
        var data = await _recipeService.DeleteRecipe(id);
        return Ok(data);
    }
}
