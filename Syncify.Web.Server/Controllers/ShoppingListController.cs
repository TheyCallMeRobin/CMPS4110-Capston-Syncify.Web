using Microsoft.AspNetCore.Mvc;
using Syncify.Web.Server.Features.ShoppingLists;
using Syncify.Common;

namespace Syncify.Web.Server.Controllers
{
    [ApiController]
    [Route("api/shopping-list")]
    public class ShoppingListController : ControllerBase
    {
        private readonly IShoppingListService _shoppingListService;

        public ShoppingListController(IShoppingListService shoppingListService)
        {
            _shoppingListService = shoppingListService;
        }

        // POST: Create a new shopping list
        [HttpPost]
        public async Task<ActionResult<Response<ShoppingListGetDto>>> Create([FromBody] ShoppingListCreateDto dto)
        {
            var data = await _shoppingListService.CreateShoppingList(dto);
            return Ok(data);
        }

        // GET: Get all shopping lists
        [HttpGet]
        public async Task<ActionResult<Response<List<ShoppingListGetDto>>>> GetAll()
        {
            var data = await _shoppingListService.GetShoppingLists();
            return Ok(data);
        }

        // GET: Get a single shopping list by ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Response<ShoppingListGetDto>>> GetById(int id)
        {
            var data = await _shoppingListService.GetShoppingListById(id);
            return Ok(data);
        }

        // PUT: Update an existing shopping list
        [HttpPut("{id}")]
        public async Task<ActionResult<Response<ShoppingListGetDto>>> Update(int id, [FromBody] ShoppingListCreateDto dto)
        {
            var data = await _shoppingListService.UpdateShoppingList(id, dto);
            return Ok(data);
        }

        // DELETE: Remove a shopping list by ID
        [HttpDelete("{id}")]
        public async Task<ActionResult<Response>> Delete(int id)
        {
            var data = await _shoppingListService.DeleteShoppingList(id);
            return Ok(data);
        }
    }
}
