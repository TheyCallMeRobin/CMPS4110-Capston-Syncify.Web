using System.Collections;
using Microsoft.AspNetCore.Mvc;
using Syncify.Web.Server.Features.Recipes;

namespace Syncify.Web.Server.Controllers
{
    
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
        public async Task<ActionResult<Task<IEnumerable<RecipeGetDto>>>> GetRecipes()
        {
            var data = await _recipeService.GetRecipes();
            return Ok(data);
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
        public async Task<ActionResult<RecipeGetDto>> CreateRecipe([FromBody] RecipeCreateDto dto)
        {
            var data = await _recipeService.CreateRecipe(dto);
            return Created(nameof(GetRecipeById), new { data.Id });
        }
    }
}
