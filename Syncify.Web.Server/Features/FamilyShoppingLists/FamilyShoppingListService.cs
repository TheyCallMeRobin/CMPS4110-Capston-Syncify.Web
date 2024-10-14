using Microsoft.EntityFrameworkCore;
using Syncify.Web.Server.Data;
using Syncify.Web.Server.Extensions;

namespace Syncify.Web.Server.Features.FamilyShoppingLists;

public interface IFamilyShoppingListService
{
    Task<Response<FamilyShoppingListGetDto>> GetFamilyShoppingListById(int id);
    Task<Response<List<FamilyShoppingListGetDto>>> GetFamilyShoppingListsByFamilyId(int familyId);
    Task<Response<FamilyShoppingListGetDto>> CreateFamilyShoppingList(FamilyShoppingListCreateDto createDto);
    Task<Response> RemoveShoppingListFromFamily(int familyShoppingListId);
}

public class FamilyShoppingListService : IFamilyShoppingListService
{
    private readonly DataContext _dataContext;

    public FamilyShoppingListService(DataContext dataContext)
    {
        _dataContext = dataContext;
    }

    public async Task<Response<FamilyShoppingListGetDto>> GetFamilyShoppingListById(int id)
    {
        var familyShoppingList = await _dataContext.Set<FamilyShoppingList>().FirstOrDefaultAsync(x => x.Id == id);
        if (familyShoppingList is null)
            return Error.AsResponse<FamilyShoppingListGetDto>("Unable to find shopping list for family.", nameof(id));

        return familyShoppingList.MapTo<FamilyShoppingListGetDto>().AsResponse();
    }

    public async Task<Response<List<FamilyShoppingListGetDto>>> GetFamilyShoppingListsByFamilyId(int familyId)
    {
        var lists = await _dataContext
            .Set<FamilyShoppingList>()
            .Where(x => x.FamilyId == familyId)
            .ProjectTo<FamilyShoppingListGetDto>()
            .ToListAsync();
        
        return lists.AsResponse();
    }

    public async Task<Response<FamilyShoppingListGetDto>> CreateFamilyShoppingList(FamilyShoppingListCreateDto createDto)
    {
        var list = await _dataContext
            .Set<FamilyShoppingList>()
            .FirstOrDefaultAsync(x => x.FamilyId == createDto.FamilyId && x.ShoppingListId == createDto.ShoppingListId);
        
        if (list is not null)
            return Error.AsResponse<FamilyShoppingListGetDto>("This shopping list already exists for this family", 
                nameof(createDto.ShoppingListId));

        var data = createDto.MapTo<FamilyShoppingList>();

        _dataContext.Set<FamilyShoppingList>().Add(data);
        await _dataContext.SaveChangesAsync();

        return data.MapTo<FamilyShoppingListGetDto>().AsResponse();
    }

    public async Task<Response> RemoveShoppingListFromFamily(int familyShoppingListId)
    {
        var list = await _dataContext.Set<FamilyShoppingList>().FirstOrDefaultAsync(x => x.Id == familyShoppingListId);
        if (list is null)
            return Error.AsResponse("Family Shopping List not found.", nameof(familyShoppingListId));

        _dataContext.Set<FamilyShoppingList>().Remove(list);
        await _dataContext.SaveChangesAsync();

        return Response.Success();
    }
}