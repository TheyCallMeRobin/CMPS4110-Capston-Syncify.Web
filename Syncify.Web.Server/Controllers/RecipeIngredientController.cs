using Microsoft.AspNetCore.Mvc;
using Syncify.Web.Server.Features.RecipeIngredients;

namespace Syncify.Web.Server.Controllers;

[ApiController]
[Route("api/recipe-ingredient")]
public class RecipeIngredientController : ControllerBase
{
    private readonly IRecipeIngredientService _ingredientService;

    public RecipeIngredientController(IRecipeIngredientService ingredientService)
    {
        _ingredientService = ingredientService;
    }

    [HttpPost]
    public async Task<ActionResult<Response<RecipeIngredientGetDto>>> Create(RecipeIngredientCreateDto dto)
    {
        var data = await _ingredientService.CreateRecipeIngredient(dto);
        return Ok(data);
    }


    [HttpGet("recipe/{recipeId}")]
    public async Task<ActionResult<Response<List<RecipeIngredientGetDto>>>> GetAll(int recipeId)
    {
        var data = await _ingredientService.GetAllIngredients(recipeId);
        return Ok(data);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Response<RecipeIngredientGetDto>>> GetById(int id)
    {
        var data = await _ingredientService.GetById(id);
        return Ok(data);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Response<RecipeIngredientGetDto>>> Update(int id, [FromBody] RecipeIngredientUpdateDto dto)
    {
        var data = await _ingredientService.UpdateRecipeIngredient(id, dto);
        return Ok(data);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<Response>> Delete(int id)
    {
        var data = await _ingredientService.DeleteRecipeIngredient(id);
        return Ok(data);
    }
}