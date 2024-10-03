using Microsoft.AspNetCore.Mvc;
using Syncify.Common;
using Syncify.Web.Server.Features.ShoppingListItems;
using Syncify.Web.Server.Features.ShoppingLists;

namespace Syncify.Web.Server.Controllers;

[ApiController]
[Route("api/shoppinglist")]
public class ShoppingListsController : ControllerBase
{
    private readonly IShoppingListService _shoppingListService;
    private readonly IShoppingListItemService _shoppingListItemService;

    public ShoppingListsController(IShoppingListService shoppingListService, IShoppingListItemService shoppingListItemService)
    {
        _shoppingListService = shoppingListService;
        _shoppingListItemService = shoppingListItemService;
    }

    [HttpGet]
    public async Task<ActionResult<Response<List<ShoppingListGetDto>>>> GetShoppingLists()
    {
        var data = await _shoppingListService.GetShoppingLists();
        return Ok(data);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Response<ShoppingListGetDto>>> GetShoppingListById(int id)
    {
        var data = await _shoppingListService.GetShoppingListById(id);
        if (data.Data != null)
        {
            var shoppingListItems = await _shoppingListItemService.GetShoppingListItemsByShoppingListId(id);

            var shoppingListDto = new ShoppingListGetDto(
                data.Data.Id,
                data.Data.Name,
                data.Data.Description,
                shoppingListItems.Data
            );

            return Ok(shoppingListDto.AsResponse());
        }

        return NotFound(new { message = "Shopping list not found." });
    }

    [HttpGet("by-user/{userId}")]
    public async Task<ActionResult<Response<List<ShoppingListGetDto>>>> GetShoppingListsByUserId(int userId)
    {
        var data = await _shoppingListService.GetShoppingListsByUserId(userId);
        if (data.HasErrors)
        {
            return BadRequest(data);
        }
        return Ok(data);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    public async Task<ActionResult<Response<ShoppingListGetDto>>> CreateShoppingList([FromBody] ShoppingListCreateDto dto)
    {
        var data = await _shoppingListService.CreateShoppingList(dto);
        return Ok(data);
    }

    [HttpPatch("{id}")]
    public async Task<IActionResult> UpdateShoppingList(int id, [FromBody] ShoppingListUpdateDto dto)
    {
        var existingList = await _shoppingListService.GetShoppingListById(id);
        if (existingList.Data == null)
        {
            return NotFound(new { message = "Shopping list not found." });
        }

        var updateResult = await _shoppingListService.UpdateShoppingList(id, dto);

        if (updateResult.HasErrors)
        {
            return BadRequest(new { message = "Failed to update shopping list.", errors = updateResult.Errors });
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

        await _shoppingListService.DeleteShoppingList(id);
        return NoContent();
    }
}

