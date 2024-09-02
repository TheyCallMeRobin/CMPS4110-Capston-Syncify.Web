using Microsoft.AspNetCore.Mvc;
using Syncify.Web.Server.Features.Recipes;

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

    [HttpGet]
    public async Task<ActionResult<RecipeGetDto[]>> GetRecipes()
    {
        var data = await _recipeService.GetRecipes();
        var results = data.ToArray(); 
        return Ok(results);
    }
        
    [HttpGet("{id}")]
    public async Task<ActionResult<RecipeGetDto?>> GetRecipeById(int id)
    {
        var data = await _recipeService.GetRecipeById(id);
        if (data is null)
            return NotFound(data);

        return Ok(data);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    public async Task<ActionResult<RecipeGetDto>> CreateRecipe([FromBody] RecipeCreateDto dto)
    {
        var data = await _recipeService.CreateRecipe(dto);
        return Ok(data);
    }
}