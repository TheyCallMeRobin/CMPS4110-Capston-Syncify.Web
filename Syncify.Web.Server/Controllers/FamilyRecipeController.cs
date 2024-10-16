using Microsoft.AspNetCore.Mvc;
using Syncify.Web.Server.Extensions;
using Syncify.Web.Server.Features.FamilyRecipes;

namespace Syncify.Web.Server.Controllers;

[ApiController]
[Route("api/family-recipes")]
public class FamilyRecipeController : ControllerBase
{
    private readonly IFamilyRecipeService _familyRecipeService;

    public FamilyRecipeController(IFamilyRecipeService familyRecipeService)
    {
        _familyRecipeService = familyRecipeService;
    }

    [HttpPost]
    public async Task<ActionResult<Response<FamilyRecipeGetDto>>> CreateFamilyRecipe(
        [FromBody] FamilyRecipeCreateDto dto)
    {
        var data = await _familyRecipeService.CreateFamilyRecipe(dto with
        {
            CreatedByUserId = HttpContext.User.GetCurrentUserId() ?? 0
        });
        return Ok(data);
    }

    [HttpGet("family/{familyId}")]
    public async Task<ActionResult<Response<List<FamilyRecipeGetDto>>>> GetFamilyRecipes(int familyId)
    {
        var data = await _familyRecipeService.GetFamilyRecipesByFamilyId(familyId);
        return Ok(data);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Response<FamilyRecipeGetDto>>> GetFamilyRecipeById(int id)
    {
        var data = await _familyRecipeService.GetFamilyRecipeById(id);
        return Ok(data);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<Response>> RemoveRecipeFromFamily(int id)
    {
        var data = await _familyRecipeService.RemoveRecipeFromFamily(id);
        return Ok(data);
    }
}