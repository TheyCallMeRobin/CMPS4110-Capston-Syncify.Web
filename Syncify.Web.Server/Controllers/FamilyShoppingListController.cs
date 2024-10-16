using Microsoft.AspNetCore.Mvc;
using Syncify.Web.Server.Features.FamilyShoppingLists;

namespace Syncify.Web.Server.Controllers;

[ApiController]
[Route("api/family-shopping-lists")]
public class FamilyShoppingListController : ControllerBase
{
    private readonly IFamilyShoppingListService _familyShoppingListService;

    public FamilyShoppingListController(IFamilyShoppingListService familyShoppingListService)
    {
        _familyShoppingListService = familyShoppingListService;
    }

    [HttpPost]
    public async Task<ActionResult<Response<FamilyShoppingListGetDto>>> CreateFamilyShoppingList(
        [FromBody] FamilyShoppingListCreateDto dto)
    {
        var data = await _familyShoppingListService.CreateFamilyShoppingList(dto);
        return Ok(data);
    }

    [HttpGet("family/{familyId}")]
    public async Task<ActionResult<Response<List<FamilyShoppingListGetDto>>>> GetFamilyShoppingLists(int familyId)
    {
        var data = await _familyShoppingListService.GetFamilyShoppingListsByFamilyId(familyId);
        return Ok(data);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Response<FamilyShoppingListGetDto>>> GetFamilyShoppingListById(int id)
    {
        var data = await _familyShoppingListService.GetFamilyShoppingListById(id);
        return Ok(data);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<Response>> RemoveShoppingListFromFamily(int id)
    {
        var data = await _familyShoppingListService.RemoveShoppingListFromFamily(id);
        return Ok(data);
    }
}