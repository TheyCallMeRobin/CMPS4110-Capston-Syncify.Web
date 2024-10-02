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

    [HttpGet("{id}")]
    public async Task<ActionResult<Response<ShoppingListItemGetDto>>> GetShoppingListItemById(int id)
    {
        var data = await _shoppingListItemService.GetShoppingListItemById(id);
        return Ok(data);
    }
}