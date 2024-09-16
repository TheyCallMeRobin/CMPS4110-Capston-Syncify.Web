using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Serilog;
using Syncify.Web.Server.Features.ShoppingLists;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Syncify.Web.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ShoppingListsController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IShoppingListService _shoppingListService;

        public ShoppingListsController(IMapper mapper, IShoppingListService shoppingListService)
        {
            _mapper = mapper;
            _shoppingListService = shoppingListService;
        }

        // GET: api/shoppinglist
        [HttpGet]
        public async Task<IActionResult> GetItems()
        {
            var shoppingItems = await _shoppingListService.GetShoppingItems();

            // Return an empty array if no items are found
            if (shoppingItems.Data == null || shoppingItems.Data.Count == 0)
            {
                return Ok(new List<ShoppingItemGetDto>());  // Return an empty array
            }

            return Ok(shoppingItems);
        }

        // POST: api/shoppinglists
        [HttpPost]
        public async Task<IActionResult> AddItem([FromBody] ShoppingItemCreateDto createDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                Log.Information("Received POST request to add item: {@CreateDto}", createDto);

                var shoppingItem = _mapper.Map<ShoppingItem>(createDto);

                Log.Information("Mapped ShoppingItem: {@ShoppingItem}", shoppingItem);

                var result = await _shoppingListService.CreateShoppingItem(shoppingItem);

                Log.Information("Successfully created shopping item: {@Result}", result);

                return Ok(result);
            }
            catch (Exception ex)
            {
                Log.Error(ex, "Error occurred while adding shopping item");
                return StatusCode(500, "An error occurred while creating the shopping item.");
            }
        }


        // PATCH: api/shoppinglist/{id}
        [HttpPatch("{id}")]
        public async Task<IActionResult> UpdateItem(int id, [FromBody] ShoppingItemCreateDto updatedDto)
        {
            var item = await _shoppingListService.GetShoppingItemById(id);
            if (item == null)
            {
                Log.Error("Shopping item with Id {Id} not found", id); // Log this
                return NotFound();
            }

            var updatedItem = _mapper.Map<ShoppingItem>(updatedDto);
            updatedItem.Id = id;

            try
            {
                await _shoppingListService.UpdateItem(updatedItem);
                return Ok(updatedItem);
            }
            catch (Exception ex)
            {
                Log.Error(ex, "Error while updating shopping item with Id: {Id}", id);
                return StatusCode(500, "An error occurred while updating the shopping item.");
            }
        }

        // DELETE: api/shoppinglist/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteItem(int id)
        {
            var item = await _shoppingListService.GetShoppingItemById(id);
            if (item == null)
            {
                return NotFound();
            }

            try
            {
                await _shoppingListService.DeleteItem(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                Log.Error(ex, "Error while deleting shopping item with Id: {Id}", id);
                return StatusCode(500, "An error occurred while deleting the shopping item.");
            }
        }
    }
}
