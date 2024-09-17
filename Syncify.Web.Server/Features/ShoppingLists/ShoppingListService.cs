using Microsoft.EntityFrameworkCore;
using Syncify.Common;
using Syncify.Common.Errors;
using Syncify.Common.Extensions;
using Syncify.Web.Server.Data;
using Syncify.Web.Server.Extensions;

namespace Syncify.Web.Server.Features.ShoppingLists;

public interface IShoppingListService
{
    Task<Response<List<ShoppingListGetDto>>> GetShoppingLists();
    Task<Response<ShoppingListGetDto>> GetShoppingListById(int id);
    Task<Response<ShoppingListGetDto>> CreateShoppingList(ShoppingListCreateDto createDto);
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

    public async Task<Response<ShoppingListGetDto>> CreateShoppingList(ShoppingListCreateDto createDto)
    {
        if (await ShoppingListHasSameName(createDto.Name))
            return Error.AsResponse<ShoppingListGetDto>("A shopping list with this name already exists.", nameof(createDto.Name));

        var shoppingList = createDto.MapTo<ShoppingList>();

        _dataContext.Set<ShoppingList>().Add(shoppingList);
        await _dataContext.SaveChangesAsync();

        return shoppingList.MapTo<ShoppingListGetDto>().AsResponse();
    }

    private Task<bool> ShoppingListHasSameName(string name)
        => _dataContext.Set<ShoppingList>().AnyAsync(x => x.Name.ToLower().Equals(name.ToLower()));
}
