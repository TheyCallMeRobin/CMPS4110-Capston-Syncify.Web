using Microsoft.EntityFrameworkCore;
using Syncify.Common;
using Syncify.Common.Errors;
using Syncify.Common.Extensions;
using Syncify.Web.Server.Data;
using Syncify.Web.Server.Extensions;
using Syncify.Web.Server.Features.ShoppingListItems;

namespace Syncify.Web.Server.Features.ShoppingLists;

public interface IShoppingListService
{
    Task<Response<List<ShoppingListGetDto>>> GetShoppingLists();
    Task<Response<ShoppingListGetDto>> GetShoppingListById(int id);
    Task<Response<List<ShoppingListGetDto>>> GetShoppingListsByUserId(int userId);
    Task<Response<ShoppingListGetDto>> CreateShoppingList(ShoppingListCreateDto createDto);
    Task<Response<ShoppingListGetDto>> UpdateShoppingList(int id, ShoppingListUpdateDto updateDto);
    Task DeleteShoppingList(int id);
}

public class ShoppingListService : IShoppingListService
{
    private readonly DataContext _dataContext;

    public ShoppingListService(DataContext dataContext)
    {
        _dataContext = dataContext;
    }

    public async Task<Response<List<ShoppingListGetDto>>> GetShoppingLists()
    {
        var data = await _dataContext
            .Set<ShoppingList>()
            .Select(x => x.MapTo<ShoppingListGetDto>())
            .ToListAsync();

        return data.AsResponse();
    }

    public async Task<Response<ShoppingListGetDto>> GetShoppingListById(int id)
    {
        var data = await _dataContext.ShoppingLists
            .Include(s => s.ShoppingListItems)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (data is null)
            return Error.AsResponse<ShoppingListGetDto>("Unable to find shopping list.", nameof(id));

        return data.MapTo<ShoppingListGetDto>().AsResponse();
    }

    public async Task<Response<List<ShoppingListGetDto>>> GetShoppingListsByUserId(int userId)
    {
        var data = await _dataContext
            .Set<ShoppingList>()
            .Where(x => x.UserId == userId)
            .Select(x => x.MapTo<ShoppingListGetDto>())
            .ToListAsync();

        return data.AsResponse();
    }

    public async Task<Response<ShoppingListGetDto>> CreateShoppingList(ShoppingListCreateDto createDto)
    {
        if (await ShoppingListHasSameName(createDto.Name, createDto.UserId))
            return Error.AsResponse<ShoppingListGetDto>("A shopping list with this name already exists for this user.", nameof(createDto.Name));

        var shoppingList = createDto.MapTo<ShoppingList>();

        _dataContext.Set<ShoppingList>().Add(shoppingList);
        await _dataContext.SaveChangesAsync();

        return shoppingList.MapTo<ShoppingListGetDto>().AsResponse();
    }

    public async Task<Response<ShoppingListGetDto>> UpdateShoppingList(int id, ShoppingListUpdateDto updateDto)
    {
        var shoppingList = await _dataContext.ShoppingLists
            .Include(s => s.ShoppingListItems)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (shoppingList == null)
            return Error.AsResponse<ShoppingListGetDto>("Shopping list not found");

        // Update basic properties
        shoppingList.Name = updateDto.Name;
        shoppingList.Description = updateDto.Description ?? shoppingList.Description;

        // Update ShoppingListItems
        foreach (var updatedItem in updateDto.ShoppingListItems)
        {
            var existingItem = shoppingList.ShoppingListItems
                .FirstOrDefault(item => item.Id == updatedItem.Id);

            if (existingItem != null)
            {
                // Update existing item
                existingItem.Name = updatedItem.Name;
                existingItem.Checked = updatedItem.Checked;
            }
            else
            {
                // Add new item
                shoppingList.ShoppingListItems.Add(updatedItem.MapTo<ShoppingListItem>());
            }
        }

        // Remove items that are no longer in the updated list
        shoppingList.ShoppingListItems.RemoveAll(item =>
            !updateDto.ShoppingListItems.Any(updated => updated.Id == item.Id));

        await _dataContext.SaveChangesAsync();

        return shoppingList.MapTo<ShoppingListGetDto>().AsResponse();
    }

    public async Task DeleteShoppingList(int id)
    {
        var shoppingList = await _dataContext.ShoppingLists
            .Include(s => s.ShoppingListItems)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (shoppingList != null)
        {
            _dataContext.ShoppingListItems.RemoveRange(shoppingList.ShoppingListItems);
            _dataContext.ShoppingLists.Remove(shoppingList);
            await _dataContext.SaveChangesAsync();
        }
    }

    private Task<bool> ShoppingListHasSameName(string name, int userId)
    {
        return _dataContext.Set<ShoppingList>()
            .AnyAsync(x => x.Name.ToLower().Equals(name.ToLower()) && x.UserId == userId);
    }
}
