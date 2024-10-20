using Microsoft.EntityFrameworkCore;
using Serilog;
using Syncify.Web.Server.Data;
using Syncify.Web.Server.Extensions;
using Syncify.Web.Server.Features.RecipeIngredients;
using Syncify.Web.Server.Features.Recipes;
using Syncify.Web.Server.Features.ShoppingListItems;

namespace Syncify.Web.Server.Features.ShoppingLists;

public class RecipeToShoppingListFacade
{
    private readonly DataContext _dataContext;

    public RecipeToShoppingListFacade(DataContext dataContext)
    {
        _dataContext = dataContext;
    }

    public async Task<Response<ShoppingListGetDto>> CreateListFromRecipe(ShoppingListRecipeCreateDto dto)
    {
        await using var transaction = await _dataContext.Database.BeginTransactionAsync();
        try
        {
            var shoppingList = await CreateShoppingList(dto);
            var ingredients = GetRecipeIngredients(dto.RecipeId);

            var items = await ingredients
                .Select(x => new ShoppingListItem
                {
                    Name = x.Name,
                    Description = x.Description,
                    Unit = x.Unit,
                    Quantity = x.Quantity,
                    ShoppingListId = shoppingList.Id
                }).ToListAsync();

            await _dataContext.Set<ShoppingListItem>().AddRangeAsync(items);

            await _dataContext.SaveChangesAsync();
            await transaction.CommitAsync();

            var list = await _dataContext.Set<ShoppingList>()
                .Include(x => x.ShoppingListItems)
                .ProjectTo<ShoppingListGetDto>()
                .FirstAsync(x => x.Id == shoppingList.Id);

            return list.AsResponse();
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            Log.Error(ex, "An error has occured.");
            return Error.AsResponse<ShoppingListGetDto>(ex.Message);
        }
    }

    private async Task<ShoppingList> CreateShoppingList(ShoppingListCreateDto dto)
    {
        var shoppingList = dto.MapTo<ShoppingList>();

        _dataContext.Set<ShoppingList>().Add(shoppingList);
        await _dataContext.SaveChangesAsync();

        return shoppingList;
    }

    private IQueryable<RecipeIngredient> GetRecipeIngredients(int recipeId)
        => _dataContext
            .Set<Recipe>()
            .Include(x => x.RecipeIngredients)
            .Where(x => x.Id == recipeId)
            .SelectMany(x => x.RecipeIngredients);

}