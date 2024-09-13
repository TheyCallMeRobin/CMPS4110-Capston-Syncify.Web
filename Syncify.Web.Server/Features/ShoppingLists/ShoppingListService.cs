using Syncify.Common; 
using Syncify.Web.Server.Features.ShoppingLists;

namespace Syncify.Web.Server.Services
{
    public class ShoppingListService : IShoppingListService
    {
        private readonly List<ShoppingListGetDto> _shoppingLists = new List<ShoppingListGetDto>();

        public async Task<Response<List<ShoppingListGetDto>>> GetShoppingLists()
        {
            var response = new Response<List<ShoppingListGetDto>>
            {
                Data = _shoppingLists
            };

            return response;
        }

        public async Task<Response<ShoppingListGetDto>> GetShoppingListById(int id)
        {
            var shoppingList = _shoppingLists.FirstOrDefault(x => x.Id == id);
            if (shoppingList == null)
            {
                var errorResponse = new Response<ShoppingListGetDto>();
                errorResponse.AddErrors(new Error("Shopping list not found"));
                return errorResponse;
            }

            var response = new Response<ShoppingListGetDto>
            {
                Data = shoppingList
            };

            return response;
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

            var response = new Response<ShoppingListGetDto>
            {
                Data = newShoppingList
            };

            return response;
        }

        public async Task<Response<ShoppingListGetDto>> UpdateShoppingList(int id, ShoppingListCreateDto dto)
        {
            var shoppingList = _shoppingLists.FirstOrDefault(x => x.Id == id);
            if (shoppingList == null)
            {
                var errorResponse = new Response<ShoppingListGetDto>();
                errorResponse.AddErrors(new Error("Shopping list not found"));
                return errorResponse;
            }

            shoppingList.Name = dto.Name;
            shoppingList.Items = dto.Items;

            var response = new Response<ShoppingListGetDto>
            {
                Data = shoppingList
            };

            return response;
        }

        public async Task<Response> DeleteShoppingList(int id)
        {
            var shoppingList = _shoppingLists.FirstOrDefault(x => x.Id == id);
            if (shoppingList == null)
            {
                var errorResponse = new Response();
                errorResponse.AddErrors(new Error("Shopping list not found"));
                return errorResponse;
            }

            _shoppingLists.Remove(shoppingList);

            return Response.Success();
        }
    }
}
