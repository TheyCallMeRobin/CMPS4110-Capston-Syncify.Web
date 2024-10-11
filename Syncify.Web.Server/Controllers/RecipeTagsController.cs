using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Mvc;
using Syncify.Common;
using Syncify.Web.Server.Features.RecipeTags;

namespace Syncify.Web.Server.Features.Recipes
{
    [ApiController]
    [Route("api/recipetags")]
    public class RecipeTagsController : ControllerBase
    {
        private readonly IRecipeTagService _recipeTagService;  
        private readonly ILogger<RecipeTagsController> _logger;

        public RecipeTagsController(IRecipeTagService recipeTagService, ILogger<RecipeTagsController> logger)  
        {
            _recipeTagService = recipeTagService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<Response<List<RecipeTagDto>>>> GetTags()
        {
            try
            {
                var result = await _recipeTagService.GetTags();
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while fetching tags.");
                return StatusCode(500, "An error occurred while fetching tags.");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Response<RecipeTagDto>>> GetTagById(int id)
        {
            try
            {
                var result = await _recipeTagService.GetTagById(id);
                if (result.HasErrors)
                {
                    return NotFound(result);
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error while fetching tag with ID {id}.");
                return StatusCode(500, "An error occurred while fetching the tag.");
            }
        }

        [HttpPost]
        public async Task<ActionResult<Response<RecipeTagDto>>> CreateTag([FromBody] RecipeTagCreateDto dto)
        {
            try
            {
                var result = await _recipeTagService.CreateTag(dto);
                return CreatedAtAction(nameof(GetTagById), new { id = result.Data?.Id }, result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while creating a new recipe tag.");
                return StatusCode(500, "An error occurred while creating the tag.");
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Response<RecipeTagDto>>> UpdateTag(int id, [FromBody] RecipeTagCreateDto dto)
        {
            try
            {
                var result = await _recipeTagService.UpdateTag(id, dto);
                if (result.HasErrors)
                {
                    return NotFound(result);
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error while updating tag with ID {id}.");
                return StatusCode(500, "An error occurred while updating the tag.");
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Response<bool>>> DeleteTag(int id)
        {
            try
            {
                var result = await _recipeTagService.DeleteTag(id);
                if (result.HasErrors)
                {
                    return NotFound(result);
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error while deleting tag with ID {id}.");
                return StatusCode(500, "An error occurred while deleting the tag.");
            }
        }
    }
}
