using Microsoft.EntityFrameworkCore;
using Syncify.Web.Server.Data;

namespace Syncify.Web.Server.Features.ShoppingListItems;

public interface IShoppingListItemService
{
    Task<List<ShoppingListItem>> CreateItemsFromRecipe(int recipeId);
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

    public Task<List<ShoppingListItem>> CreateItemsFromRecipe(int recipeId)
    {
        throw new NotImplementedException();
    }
}

