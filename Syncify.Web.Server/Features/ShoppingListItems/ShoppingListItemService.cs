using Microsoft.EntityFrameworkCore;
using Syncify.Web.Server.Data;
using Syncify.Web.Server.Extensions;
using Syncify.Web.Server.Features.RecipeIngredients;
using Syncify.Web.Server.Features.Recipes;

namespace Syncify.Web.Server.Features.ShoppingListItems;

public interface IShoppingListItemService
{
    Task<Response<ShoppingListItemGetDto>> GetShoppingListItemById(int id);
}

public class ShoppingListItemService : IShoppingListItemService
{

    private readonly DataContext _dataContext;

    public ShoppingListItemService(DataContext dataContext)
    {
        _dataContext = dataContext;
    }
    

    
    private Task<bool> IsItemUnique(int shoppingListId, string name)
    {
        return _dataContext
            .Set<ShoppingListItem>()
            .AnyAsync(x => x.ShoppingListId == shoppingListId && x.Name.Equals(name));
    }

    public async Task<Response<ShoppingListItemGetDto>> GetShoppingListItemById(int id)
    {
        var item = await _dataContext.Set<ShoppingListItem>().FirstOrDefaultAsync(x => x.Id == id);
        if (item is null)
            return Error.AsResponse<ShoppingListItemGetDto>("Item not found.", nameof(id));

        return item.MapTo<ShoppingListItemGetDto>().AsResponse();
    }
}

