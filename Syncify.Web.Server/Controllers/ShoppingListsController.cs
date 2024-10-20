using Microsoft.AspNetCore.Mvc;
using Syncify.Web.Server.Features.ShoppingLists;

namespace Syncify.Web.Server.Controllers;

[ApiController]
[Route("api/shopping-lists")]
public class ShoppingListsController : ControllerBase
{
    private readonly IShoppingListService _shoppingListService;

    public ShoppingListsController(IShoppingListService shoppingListService)
    {
        _shoppingListService = shoppingListService;
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
        return Ok(data);
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

    [HttpPost("recipe")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    public async Task<ActionResult<Response<ShoppingListGetDto>>> CreateListFromRecipe([FromBody] ShoppingListRecipeCreateDto dto)
    {
        var data = await _shoppingListService.CreateListFromRecipe(dto);
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

        var shoppingListToUpdate = new ShoppingListUpdateDto
        (
            dto.Name,
            dto.Description
        );

        var updateResult = await _shoppingListService.UpdateShoppingList(id, shoppingListToUpdate);

        if (updateResult.Errors != null && updateResult.Errors.Any())
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