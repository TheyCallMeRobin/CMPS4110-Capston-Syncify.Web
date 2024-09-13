namespace Syncify.Web.Server.Features.ShoppingLists
{
	public interface IShoppingListService
	{
		Task<Response<List<ShoppingListGetDto>>> GetShoppingLists();
		Task<Response<ShoppingListGetDto>> GetShoppingListById(int id);
		Task<Response<ShoppingListGetDto>> CreateShoppingList(ShoppingListCreateDto dto);
		Task<Response<ShoppingListGetDto>> UpdateShoppingList(int id, ShoppingListCreateDto dto);
		Task<Response<bool>> DeleteShoppingList(int id);
	}
}


