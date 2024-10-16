using Microsoft.EntityFrameworkCore;
using Syncify.Common;
using Syncify.Common.Errors;
using Syncify.Common.Extensions;
using Syncify.Web.Server.Data;
using Syncify.Web.Server.Extensions;
using Syncify.Web.Server.Features.FamilyShoppingLists;

namespace Syncify.Web.Server.Features.ShoppingLists;

public interface IShoppingListService
{
    Task<Response<List<ShoppingListGetDto>>> GetShoppingLists();
    Task<Response<ShoppingListGetDto>> GetShoppingListById(int id);
    Task<Response<List<ShoppingListGetDto>>> GetShoppingListsByUserId(int userId);
    Task<Response<ShoppingListGetDto>> CreateShoppingList(ShoppingListCreateDto createDto);
    Task<Response<ShoppingListGetDto>> UpdateShoppingList(int id, ShoppingListUpdateDto updateDto);
    Task<Response> DeleteShoppingList(int id);
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
        var data = await _dataContext
            .Set<ShoppingList>()
            .FindAsync(id);

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
        var shoppingList = await _dataContext.ShoppingLists.FindAsync(id);
        if (shoppingList == null)
            return Error.AsResponse<ShoppingListGetDto>("Shopping list not found");

        // Update the fields from the DTO
        shoppingList.Name = updateDto.Name;
        shoppingList.Description = updateDto.Description ?? shoppingList.Description;
        shoppingList.Checked = updateDto.Checked;  // Ensure Checked is updated
        shoppingList.Completed = updateDto.Completed;  // Ensure Completed is updated

        // Save the changes to the database
        await _dataContext.SaveChangesAsync();

        // Return the updated entity mapped to a DTO
        return shoppingList.MapTo<ShoppingListGetDto>().AsResponse();
    }


    public async Task<Response> DeleteShoppingList(int id)
    {
        var shoppingList = await _dataContext.ShoppingLists.FindAsync(id);
        if (shoppingList is null)
            return Error.AsResponse("Shopping list not found.", nameof(id));

        await using var transaction = await _dataContext.Database.BeginTransactionAsync();

        await _dataContext.SaveChangesAsync();

        await RemoveShoppingListFromFamily(shoppingList.Id);
        await _dataContext.SaveChangesAsync();

        _dataContext.Set<ShoppingList>().Remove(shoppingList);

        await _dataContext.SaveChangesAsync();
        await transaction.CommitAsync();
        
        return Response.Success();
    }

    private async Task RemoveShoppingListFromFamily(int shoppingListId)
    {
        var familyShoppingList = await _dataContext
            .Set<FamilyShoppingList>()
            .FirstOrDefaultAsync(x => x.ShoppingListId == shoppingListId);
        
        if (familyShoppingList is null)
            return;

        _dataContext.Set<FamilyShoppingList>().Remove(familyShoppingList);
    }
    
    private Task<bool> ShoppingListHasSameName(string name, int userId)
        => _dataContext.Set<ShoppingList>().AnyAsync(x => x.Name.ToLower().Equals(name.ToLower()) && x.UserId == userId);
}
