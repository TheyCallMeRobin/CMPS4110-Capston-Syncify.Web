using Microsoft.EntityFrameworkCore;
using Syncify.Common;
using Syncify.Common.Errors;
using Syncify.Common.Extensions;
using Syncify.Web.Server.Data;
using Syncify.Web.Server.Extensions;

namespace Syncify.Web.Server.Features.Recipes;

public interface IRecipeService
{
    Task<Response<List<RecipeGetDto>>> GetRecipesByUser(int userId); // Filter recipes by user ID
    Task<Response<RecipeGetDto>> GetRecipeById(int id);
    Task<Response<RecipeGetDto>> CreateRecipe(RecipeCreateDto createDto, int userId); // Pass user ID
    Task DeleteRecipe(int id); // Delete method
}

public class RecipeService : IRecipeService
{
    private readonly DataContext _dataContext;

    public RecipeService(DataContext dataContext)
    {
        _dataContext = dataContext;
    }

    public async Task<Response<List<RecipeGetDto>>> GetRecipesByUser(int userId)
    {
        var data = await _dataContext
            .Set<Recipe>()
            .Where(x => x.UserId == userId) // Filter recipes by user ID
            .Include(x => x.User) // Include User details
            .Select(x => x.MapTo<RecipeGetDto>())
            .ToListAsync();

        return data.AsResponse();
    }

    public async Task<Response<RecipeGetDto>> GetRecipeById(int id)
    {
        var data = await _dataContext
            .Set<Recipe>()
            .Include(x => x.User)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (data is null)
            return Error.AsResponse<RecipeGetDto>("Unable to find recipe.", nameof(id));

        return data.MapTo<RecipeGetDto>().AsResponse();
    }

    public async Task<Response<RecipeGetDto>> CreateRecipe(RecipeCreateDto createDto, int userId)
    {
        if (await RecipeHasSameName(createDto.Name))
            return Error.AsResponse<RecipeGetDto>("A recipe with this name already exists.", nameof(createDto.Name));

        var recipe = createDto.MapTo<Recipe>();
        recipe.UserId = userId; // Link recipe to the logged-in user

        _dataContext.Set<Recipe>().Add(recipe);
        await _dataContext.SaveChangesAsync();

        return recipe.MapTo<RecipeGetDto>().AsResponse();
    }

    public async Task DeleteRecipe(int id)
    {
        var recipe = await _dataContext.Set<Recipe>().FindAsync(id);
        if (recipe != null)
        {
            _dataContext.Set<Recipe>().Remove(recipe);
            await _dataContext.SaveChangesAsync();
        }
    }

    private Task<bool> RecipeHasSameName(string name)
        => _dataContext.Set<Recipe>().AnyAsync(x => x.Name.ToLower().Equals(name.ToLower()));
}
