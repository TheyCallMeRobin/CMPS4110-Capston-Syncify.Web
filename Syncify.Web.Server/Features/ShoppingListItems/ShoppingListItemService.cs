using Microsoft.EntityFrameworkCore;
using Syncify.Common;
using Syncify.Common.Errors;
using Syncify.Common.Extensions;
using Syncify.Web.Server.Data;
using Syncify.Web.Server.Extensions;
using Syncify.Web.Server.Features.ShoppingLists;

namespace Syncify.Web.Server.Features.ShoppingListItems;

public interface IShoppingListItemService
{
    Task<Response<List<ShoppingListItemGetDto>>> GetShoppingListItems();
    Task<Response<ShoppingListItemGetDto>> GetShoppingListItemById(int id);
    Task<Response<List<ShoppingListItemGetDto>>> GetShoppingListItemsByShoppingListId(int shoppingListId);
    Task<Response<ShoppingListItemGetDto>> CreateShoppingListItem(ShoppingListItemCreateDto createDto);
    Task<Response<ShoppingListItemGetDto>> UpdateShoppingListItem(int id, ShoppingListItemUpdateDto updateDto);
    Task DeleteShoppingListItem(int id);
    Task DeleteShoppingListItemsByShoppingListId(int shoppingListId);
}

public class ShoppingListItemService : IShoppingListItemService
{
    private readonly DataContext _dataContext;

    public ShoppingListItemService(DataContext dataContext)
    {
        _dataContext = dataContext;
    }

    public async Task<Response<List<ShoppingListItemGetDto>>> GetShoppingListItems()
    {
        var data = await _dataContext
            .Set<ShoppingListItem>()
            .Select(x => x.MapTo<ShoppingListItemGetDto>())
            .ToListAsync();

        return data.AsResponse();
    }

    public async Task<Response<ShoppingListItemGetDto>> GetShoppingListItemById(int id)
    {
        var data = await _dataContext.ShoppingListItems
            .FirstOrDefaultAsync(x => x.Id == id);

        if (data is null)
            return Error.AsResponse<ShoppingListItemGetDto>("Unable to find shopping list item.", nameof(id));

        return data.MapTo<ShoppingListItemGetDto>().AsResponse();
    }

    public async Task<Response<List<ShoppingListItemGetDto>>> GetShoppingListItemsByShoppingListId(int shoppingListId)
    {
        var data = await _dataContext
            .Set<ShoppingListItem>()
            .Where(x => x.ShoppingListId == shoppingListId)
            .Select(x => x.MapTo<ShoppingListItemGetDto>())
            .ToListAsync();

        return data.AsResponse();
    }

    public async Task<Response<ShoppingListItemGetDto>> CreateShoppingListItem(ShoppingListItemCreateDto createDto)
    {
        var validator = new ShoppingListItemCreateDtoValidator();
        var validationResult = validator.Validate(createDto);

        if (!validationResult.IsValid)
        {
            var errorMessages = string.Join("; ", validationResult.Errors.Select(e => e.ErrorMessage));
            return Error.AsResponse<ShoppingListItemGetDto>(errorMessages);
        }

        var shoppingListItem = createDto.MapTo<ShoppingListItem>();

        _dataContext.Set<ShoppingListItem>().Add(shoppingListItem);
        await _dataContext.SaveChangesAsync();

        return shoppingListItem.MapTo<ShoppingListItemGetDto>().AsResponse();
    }

    public async Task<Response<ShoppingListItemGetDto>> UpdateShoppingListItem(int id, ShoppingListItemUpdateDto updateDto)
    {
        var shoppingListItem = await _dataContext.ShoppingListItems.FindAsync(id);
        if (shoppingListItem == null)
            return Error.AsResponse<ShoppingListItemGetDto>("Shopping list item not found");

        shoppingListItem.Name = updateDto.Name;
        shoppingListItem.Checked = updateDto.Checked;

        await _dataContext.SaveChangesAsync();

        return shoppingListItem.MapTo<ShoppingListItemGetDto>().AsResponse();
    }

    public async Task DeleteShoppingListItem(int id)
    {
        var item = await _dataContext.ShoppingListItems.FindAsync(id);
        if (item != null)
        {
            _dataContext.ShoppingListItems.Remove(item);
            await _dataContext.SaveChangesAsync();
        }
    }

    public async Task DeleteShoppingListItemsByShoppingListId(int shoppingListId)
    {
        var shoppingListItems = await _dataContext.ShoppingListItems
            .Where(x => x.ShoppingListId == shoppingListId)
            .ToListAsync();

        if (shoppingListItems.Any())
        {
            _dataContext.ShoppingListItems.RemoveRange(shoppingListItems);
            await _dataContext.SaveChangesAsync();
        }
    }

}
