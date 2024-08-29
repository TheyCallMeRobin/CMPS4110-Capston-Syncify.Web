using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Syncify.Web.Server.Data;

namespace Syncify.Web.Server.Features.Recipes;

public interface IRecipeService
{
    Task<IEnumerable<RecipeGetDto>> GetRecipes();
    Task<RecipeGetDto?> GetRecipeById(int id);
    Task<RecipeGetDto> CreateRecipe(RecipeCreateDto createDto);
}

public class RecipeService : IRecipeService
{

    private readonly DataContext _dataContext;

    public RecipeService(DataContext dataContext)
    {
        _dataContext = dataContext;
    }

    public async Task<IEnumerable<RecipeGetDto>> GetRecipes()
    {
        var data = await _dataContext
            .Set<Recipe>()
            .Select(x => x.MapTo<RecipeGetDto>())
            .ToListAsync();

        return data;
    }

    public async Task<RecipeGetDto?> GetRecipeById(int id)
    {
        var data = await _dataContext
            .Set<Recipe>()
            .FindAsync(id);
        
        return data.MapTo<RecipeGetDto>();
    }

    public async Task<RecipeGetDto> CreateRecipe(RecipeCreateDto createDto)
    {
        var recipe = createDto.MapTo<Recipe>();
        _dataContext.Set<Recipe>().Add(recipe);

        await _dataContext.SaveChangesAsync();

        return recipe.MapTo<RecipeGetDto>();

    }
}