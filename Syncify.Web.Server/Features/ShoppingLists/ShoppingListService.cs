using Microsoft.EntityFrameworkCore;
using Syncify.Common;
using Syncify.Common.Errors;
using Syncify.Common.Extensions;
using Syncify.Web.Server.Data;
using Syncify.Web.Server.Extensions;

namespace Syncify.Web.Server.Features.ShoppingLists;

public interface IShoppingListService
{
    Task<Response<List<ShoppingItemGetDto>>> GetShoppingItems();
    Task<Response<ShoppingItemGetDto>> GetShoppingItemById(int id);
    Task<Response<ShoppingItemGetDto>> CreateShoppingItem(ShoppingItem item);
    Task UpdateItem(ShoppingItem item);
    Task DeleteItem(int id);
}

public class ShoppingListService : IShoppingListService
{
    private readonly DataContext _dataContext;

    public ShoppingListService(DataContext dataContext)
    {
        _dataContext = dataContext;
    }

    public async Task<Response<List<ShoppingItemGetDto>>> GetShoppingItems()
    {
        var data = await _dataContext
            .Set<ShoppingItem>()
            .Select(x => x.MapTo<ShoppingItemGetDto>())
            .ToListAsync();

        return data.AsResponse();
    }

    public async Task<Response<ShoppingItemGetDto>> GetShoppingItemById(int id)
    {
        var data = await _dataContext
            .Set<ShoppingItem>()
            .FindAsync(id);

        if (data is null)
            return Error.AsResponse<ShoppingItemGetDto>("Unable to find shopping item.", nameof(id));

        return data.MapTo<ShoppingItemGetDto>().AsResponse();
    }

    public async Task<Response<ShoppingItemGetDto>> CreateShoppingItem(ShoppingItem item)
    {
        _dataContext.Set<ShoppingItem>().Add(item);
        await _dataContext.SaveChangesAsync();

        return item.MapTo<ShoppingItemGetDto>().AsResponse();
    }

    public async Task UpdateItem(ShoppingItem item)
    {
        var existingItem = await _dataContext.Set<ShoppingItem>().FindAsync(item.Id);
        if (existingItem != null)
        {
            _dataContext.Entry(existingItem).State = EntityState.Detached;  // Detach the existing entity
        }

        _dataContext.Set<ShoppingItem>().Update(item);
        await _dataContext.SaveChangesAsync();
    }


    public async Task DeleteItem(int id)
    {
        var item = await _dataContext.Set<ShoppingItem>().FindAsync(id);
        if (item != null)
        {
            _dataContext.Set<ShoppingItem>().Remove(item);
            await _dataContext.SaveChangesAsync();
        }
    }
}
