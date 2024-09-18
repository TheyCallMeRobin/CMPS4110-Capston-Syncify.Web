using Microsoft.AspNetCore.Mvc;
using Syncify.Common;
using Syncify.Web.Server.Features.ShoppingLists;

namespace Syncify.Web.Server.Controllers;

[ApiController]
[Route("api/shoppinglist")]
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

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    public async Task<ActionResult<Response<ShoppingListGetDto>>> CreateShoppingList([FromBody] ShoppingListCreateDto dto)
    {
        var data = await _shoppingListService.CreateShoppingList(dto);
        return Ok(data);
    }
}
