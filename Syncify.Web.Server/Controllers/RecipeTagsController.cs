using Microsoft.AspNetCore.Mvc;
using Syncify.Web.Server.Features.RecipeTags;

namespace Syncify.Web.Server.Features.Recipes
{
    [ApiController]
    [Route("api/recipetags")]
    public class RecipeTagsController : ControllerBase
    {
        private readonly RecipeTagService _recipeTagService;

        public RecipeTagsController(RecipeTagService recipeTagService)
        {
            _recipeTagService = recipeTagService;
        }

        [HttpGet]
        public async Task<ActionResult<Response<List<RecipeTagDto>>>> GetTags()
        {
            var result = await _recipeTagService.GetTags();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Response<RecipeTagDto>>> GetTagById(int id)
        {
            var result = await _recipeTagService.GetTagById(id);
            if (result.HasErrors)
            {
                return NotFound(result);
            }

            return Ok(result);
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
            var result = await _recipeTagService.UpdateTag(id, dto);
            if (result.HasErrors)
            {
                return NotFound(result);
            }

            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Response<bool>>> DeleteTag(int id)
        {
            var result = await _recipeTagService.DeleteTag(id);
            if (result.HasErrors)
            {
                return NotFound(result);
            }

            return Ok(result);
        }
    }
}
