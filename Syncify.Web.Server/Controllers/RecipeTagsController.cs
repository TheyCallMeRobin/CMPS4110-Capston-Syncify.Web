using Microsoft.AspNetCore.Mvc;
using Syncify.Common;
using Syncify.Web.Server.Features.RecipeTags;

namespace Syncify.Web.Server.Features.Recipes
{
    [ApiController]
    [Route("api/recipetags")]
    public class RecipeTagsController : ControllerBase
    {
        private readonly IRecipeTagService _recipeTagService;  // Use IRecipeTagService

        public RecipeTagsController(IRecipeTagService recipeTagService)  // Use IRecipeTagService here
        {
            _recipeTagService = recipeTagService ?? throw new ArgumentNullException(nameof(recipeTagService));
        }

        [HttpGet]
        public async Task<ActionResult<Response<List<RecipeTagDto>>>> GetTags()
        {
            return Ok(await _recipeTagService.GetTags());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Response<RecipeTagDto>>> GetTagById(int id)
        {
            return Ok(await _recipeTagService.GetTagById(id));
        }

        [HttpPost]
        public async Task<ActionResult<Response<RecipeTagDto>>> CreateTag([FromBody] RecipeTagCreateDto dto)
        {
            var result = await _recipeTagService.CreateTag(dto);
            return CreatedAtAction(nameof(GetTagById), new { id = result.Data?.Id }, result);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Response<RecipeTagDto>>> UpdateTag(int id, [FromBody] RecipeTagCreateDto dto)
        {
            return Ok(await _recipeTagService.UpdateTag(id, dto));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Response<bool>>> DeleteTag(int id)
        {
            return Ok(await _recipeTagService.DeleteTag(id));
        }
    }
}
