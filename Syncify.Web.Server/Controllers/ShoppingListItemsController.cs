using Microsoft.AspNetCore.Mvc;
using Syncify.Common;
using Syncify.Web.Server.Features.ShoppingListItems;
using Syncify.Web.Server.Features.ShoppingLists;

namespace Syncify.Web.Server.Controllers;

[ApiController]
[Route("api/shoppinglistitem")]
public class ShoppingListItemsController : ControllerBase
{
    private readonly IShoppingListItemService _shoppingListItemService;
    private readonly IShoppingListService _shoppingListService;

    public ShoppingListItemsController(IShoppingListItemService shoppingListItemService, IShoppingListService shoppingListService)
    {
        _shoppingListItemService = shoppingListItemService;
        _shoppingListService = shoppingListService;
    }

    [HttpGet]
    public async Task<ActionResult<Response<List<ShoppingListItemGetDto>>>> GetShoppingListItems()
    {
        var data = await _shoppingListItemService.GetShoppingListItems();
        return Ok(data);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Response<ShoppingListItemGetDto>>> GetShoppingListItemById(int id)
    {
        var data = await _shoppingListItemService.GetShoppingListItemById(id);
        if (data.HasErrors)
        {
            return BadRequest(data);
        }
        return Ok(data);
    }

    [HttpGet("by-shoppinglist/{shoppingListId}")]
    public async Task<ActionResult<Response<List<ShoppingListItemGetDto>>>> GetShoppingListItemsByShoppingListId(int shoppingListId)
    {
        var data = await _shoppingListItemService.GetShoppingListItemsByShoppingListId(shoppingListId);
        if (data.HasErrors)
        {
            return BadRequest(data);
        }
        return Ok(data);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    public async Task<ActionResult<Response<ShoppingListItemGetDto>>> CreateShoppingListItem([FromBody] ShoppingListItemCreateDto dto)
    {
        var data = await _shoppingListItemService.CreateShoppingListItem(dto);
        return Ok(data);
    }

    [HttpPatch("{id}")]
    public async Task<IActionResult> UpdateShoppingListItem(int id, [FromBody] ShoppingListItemUpdateDto dto)
    {
        var existingItem = await _shoppingListItemService.GetShoppingListItemById(id);
        if (existingItem.Data == null)
        {
            return NotFound(new { message = "Shopping list item not found." });
        }

        var updateResult = await _shoppingListItemService.UpdateShoppingListItem(id, dto);

        if (updateResult.HasErrors)
        {
            return BadRequest(new { message = "Failed to update shopping list item.", errors = updateResult.Errors });
        }

        return Ok(updateResult.Data);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteShoppingList(int id)
    {
        var existingList = await _shoppingListService.GetShoppingListById(id);
        if (existingList.Data == null)
        {
            return NotFound(new { message = "Shopping list not found." });
        }

        await _shoppingListItemService.DeleteShoppingListItemsByShoppingListId(id);

        await _shoppingListService.DeleteShoppingList(id);
        return NoContent();
    }

}
