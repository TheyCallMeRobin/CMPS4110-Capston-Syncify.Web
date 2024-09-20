using Microsoft.EntityFrameworkCore;
using Syncify.Common;
using Syncify.Common.Errors;
using Syncify.Common.Extensions;
using Syncify.Web.Server.Data;
using Syncify.Web.Server.Extensions;

namespace Syncify.Web.Server.Features.Recipes;

public interface IRecipeService
{
    Task<Response<List<RecipeGetDto>>> GetRecipes();
    Task<Response<RecipeGetDto>> GetRecipeById(int id);
    Task<Response<RecipeGetDto>> CreateRecipe(RecipeCreateDto createDto);
}

public class RecipeService : IRecipeService
{
    private readonly DataContext _dataContext;

    public RecipeService(DataContext dataContext)
    {
        _dataContext = dataContext;
    }

    public async Task<Response<List<RecipeGetDto>>> GetRecipes()
    {
        var data = await _dataContext
            .Set<Recipe>()
            .Include(x => x.User) // Include User to get the FirstName
            .Select(x => x.MapTo<RecipeGetDto>())
            .ToListAsync();

        return data.AsResponse();
    }

    public async Task<Response<RecipeGetDto>> GetRecipeById(int id)
    {
        var data = await _dataContext
            .Set<Recipe>()
            .Include(x => x.User) // Include User to get the FirstName
            .FirstOrDefaultAsync(x => x.Id == id);

        if (data is null)
            return Error.AsResponse<RecipeGetDto>("Unable to find recipe.", nameof(id));

        return data.MapTo<RecipeGetDto>().AsResponse();
    }

    public async Task<Response<RecipeGetDto>> CreateRecipe(RecipeCreateDto createDto)
    {
        if (await RecipeHasSameName(createDto.Name))
            return Error.AsResponse<RecipeGetDto>("A recipe with this name already exists.", nameof(createDto.Name));

        var recipe = createDto.MapTo<Recipe>();

        _dataContext.Set<Recipe>().Add(recipe);
        await _dataContext.SaveChangesAsync();

        return recipe.MapTo<RecipeGetDto>().AsResponse();
    }

    private Task<bool> RecipeHasSameName(string name)
        => _dataContext.Set<Recipe>().AnyAsync(x => x.Name.ToLower().Equals(name.ToLower()));
}
