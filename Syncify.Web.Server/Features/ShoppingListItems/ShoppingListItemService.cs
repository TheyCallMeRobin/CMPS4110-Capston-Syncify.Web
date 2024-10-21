using Microsoft.EntityFrameworkCore;
using Syncify.Web.Server.Data;
using Syncify.Web.Server.Extensions;

namespace Syncify.Web.Server.Features.ShoppingListItems;

public interface IShoppingListItemService
{
    Task<Response<IEnumerable<ShoppingListItemGetDto>>> GetShoppingListItems(int shoppingListId);
    Task<Response<ShoppingListItemGetDto>> GetShoppingListItemById(int id);
    Task<Response<ShoppingListItemGetDto>> CreateShoppingListItem(ShoppingListItemCreateDto createDto);
    Task<Response<ShoppingListItemGetDto>> UpdateShoppingListItem(int id, ShoppingListItemUpdateDto updateDto);
    Task DeleteShoppingListItem(int id);
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

    public async Task<Response<IEnumerable<ShoppingListItemGetDto>>> GetShoppingListItems(int shoppingListId)
    {
        var items = await _dataContext.Set<ShoppingListItem>()
                                      .Where(item => item.ShoppingListId == shoppingListId)
                                      .ToListAsync();

        var dtoItems = items.Select(item => item.MapTo<ShoppingListItemGetDto>());
        return dtoItems.AsResponse();
    }

    public async Task<Response<ShoppingListItemGetDto>> GetShoppingListItemById(int id)
    {
        var item = await _dataContext.Set<ShoppingListItem>().FirstOrDefaultAsync(x => x.Id == id);
        if (item is null)
            return Error.AsResponse<ShoppingListItemGetDto>("Item not found.", nameof(id));

        return item.MapTo<ShoppingListItemGetDto>().AsResponse();
    }

    public async Task<Response<ShoppingListItemGetDto>> CreateShoppingListItem(ShoppingListItemCreateDto createDto)
    {
        var item = createDto.MapTo<ShoppingListItem>();
        _dataContext.Add(item);
        await _dataContext.SaveChangesAsync();
        return item.MapTo<ShoppingListItemGetDto>().AsResponse();
    }

    public async Task<Response<ShoppingListItemGetDto>> UpdateShoppingListItem(int id, ShoppingListItemUpdateDto updateDto)
    {
        var item = await _dataContext.Set<ShoppingListItem>().FindAsync(id);
        if (item is null)
            return Error.AsResponse<ShoppingListItemGetDto>("Item not found.", nameof(id));

        item.Name = updateDto.Name;
        item.Quantity = updateDto.Quantity;

        await _dataContext.SaveChangesAsync();
        return item.MapTo<ShoppingListItemGetDto>().AsResponse();
    }


    public async Task DeleteShoppingListItem(int id)
    {
        var item = await _dataContext.Set<ShoppingListItem>().FindAsync(id);
        if (item != null)
        {
            _dataContext.Remove(item);
            await _dataContext.SaveChangesAsync();
        }
    }
}