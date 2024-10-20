using Microsoft.AspNetCore.Mvc;
using Syncify.Web.Server.Features.ShoppingListItems;

namespace Syncify.Web.Server.Controllers;

[ApiController]
[Route("api/shopping-list-items")]
public class ShoppingListItemController : ControllerBase
{
    private readonly IShoppingListItemService _shoppingListItemService;

    public ShoppingListItemController(IShoppingListItemService shoppingListItemService)
    {
        _shoppingListItemService = shoppingListItemService;
    }

    [HttpGet("list/{shoppingListId}")]
    public async Task<ActionResult<Response<IEnumerable<ShoppingListItemGetDto>>>> GetShoppingListItems(int shoppingListId)
    {
        var data = await _shoppingListItemService.GetShoppingListItems(shoppingListId);
        return Ok(data);
    }


    [HttpGet("{id}")]
    public async Task<ActionResult<Response<ShoppingListItemGetDto>>> GetShoppingListItemById(int id)
    {
        var data = await _shoppingListItemService.GetShoppingListItemById(id);
        return Ok(data);
    }

    [HttpPost]
    public async Task<ActionResult<Response<ShoppingListItemGetDto>>> CreateShoppingListItem(ShoppingListItemCreateDto createDto)
    {
        var result = await _shoppingListItemService.CreateShoppingListItem(createDto);
        return CreatedAtAction(nameof(GetShoppingListItemById), new { id = result.Data.Id }, result);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Response<ShoppingListItemGetDto>>> UpdateShoppingListItem(int id, ShoppingListItemUpdateDto updateDto)
    {
        var result = await _shoppingListItemService.UpdateShoppingListItem(id, updateDto);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteShoppingListItem(int id)
    {
        await _shoppingListItemService.DeleteShoppingListItem(id);
        return NoContent();
    }
}