using Microsoft.AspNetCore.Mvc;
using Syncify.Common;
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
    public async Task<ActionResult<Response<List<RecipeGetDto>>>> GetRecipes()
    {
        var data = await _recipeService.GetRecipes();
        return Ok(data);
    }
    
    [HttpGet("{id}")]
    public async Task<ActionResult<Response<RecipeGetDto>>> GetRecipeById(int id)
    {
        var data = await _recipeService.GetRecipeById(id);
        return Ok(data);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    public async Task<ActionResult<Response<RecipeGetDto>>> CreateRecipe([FromBody] RecipeCreateDto dto)
    {
        var data = await _recipeService.CreateRecipe(dto);
        return Ok(data);
    }
}