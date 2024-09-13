using Syncify.Web.Server.Features.ShoppingLists;

namespace Syncify.Web.Server.Services
{
    public class ShoppingListService : IShoppingListService
    {
        
        private readonly List<ShoppingListGetDto> _shoppingLists = new List<ShoppingListGetDto>();

        public async Task<Response<List<ShoppingListGetDto>>> GetShoppingLists()
        {
            return new Response<List<ShoppingListGetDto>>(_shoppingLists);
        }

        public async Task<Response<ShoppingListGetDto>> GetShoppingListById(int id)
        {
            var shoppingList = _shoppingLists.FirstOrDefault(x => x.Id == id);
            if (shoppingList == null)
            {
                return new Response<ShoppingListGetDto>("Shopping list not found", false);
            }
            return new Response<ShoppingListGetDto>(shoppingList);
        }

        public async Task<Response<ShoppingListGetDto>> CreateShoppingList(ShoppingListCreateDto dto)
        {
            var newShoppingList = new ShoppingListGetDto
            {
                Id = _shoppingLists.Count + 1,
                Name = dto.Name,
                Items = dto.Items
            };
            _shoppingLists.Add(newShoppingList);
            return new Response<ShoppingListGetDto>(newShoppingList);
        }

        public async Task<Response<ShoppingListGetDto>> UpdateShoppingList(int id, ShoppingListCreateDto dto)
        {
            var shoppingList = _shoppingLists.FirstOrDefault(x => x.Id == id);
            if (shoppingList == null)
            {
                return new Response<ShoppingListGetDto>("Shopping list not found", false);
            }
            shoppingList.Name = dto.Name;
            shoppingList.Items = dto.Items;
            return new Response<ShoppingListGetDto>(shoppingList);
        }

        public async Task<Response<bool>> DeleteShoppingList(int id)
        {
            var shoppingList = _shoppingLists.FirstOrDefault(x => x.Id == id);
            if (shoppingList == null)
            {
                return new Response<bool>("Shopping list not found", false);
            }
            _shoppingLists.Remove(shoppingList);
            return new Response<bool>(true);
        }
    }
}
