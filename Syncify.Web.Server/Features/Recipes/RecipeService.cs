using Bogus;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Syncify.Web.Server.Data;
using Syncify.Web.Server.Extensions;

namespace Syncify.Web.Server.Features.Recipes;

public interface IRecipeService
{
    Task<Response<List<RecipeGetDto>>> GetRecipes();
    Task<Response<RecipeGetDto>> GetRecipeById(int id);
    Task<Response<List<RecipeGetDto>>> GetRecipesByUserId(int userId);
    Task<Response<RecipeGetDto>> GetRecipeOfTheDay();
    Task<Response<RecipeGetDto>> CreateRecipe(RecipeCreateDto createDto);
}

public class RecipeService : IRecipeService
{
    private readonly DataContext _dataContext;
    private readonly IMemoryCache _memoryCache;

    private const string RECIPE_OF_THE_DAY_CACHE_KEY = nameof(RECIPE_OF_THE_DAY_CACHE_KEY);
    
    public RecipeService(DataContext dataContext, IMemoryCache memoryCache)
    {
        _dataContext = dataContext;
        _memoryCache = memoryCache;
    }

    public async Task<Response<List<RecipeGetDto>>> GetRecipes()
    {
        var data = await _dataContext
            .Set<Recipe>()
            .Include(x => x.User)
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

    public async Task<Response<List<RecipeGetDto>>> GetRecipesByUserId(int userId)
    {
        var data = await _dataContext
            .Set<Recipe>()
            .Where(x => x.UserId == userId)
            .ProjectTo<RecipeGetDto>()
            .ToListAsync();

        return data.AsResponse();
    }

    public async Task<Response<RecipeGetDto>> GetRecipeOfTheDay()
    {
        var cachedRecipe = GetCachedRecipeOfTheDay();
        if (cachedRecipe is not null)
            return cachedRecipe.AsResponse();
        
        var data = await _dataContext
            .Set<Recipe>()
            .Where(x => !string.IsNullOrWhiteSpace(x.Name))
            .OrderBy(_ => Guid.NewGuid())
            .FirstOrDefaultAsync();
        
        if (data is null)
            return Error.AsResponse<RecipeGetDto>("No recipe of the day");

        _memoryCache.Set(RECIPE_OF_THE_DAY_CACHE_KEY, data.MapTo<RecipeGetDto>(), DateTimeOffset.Now.AddHours(24));
        
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

    private RecipeGetDto? GetCachedRecipeOfTheDay()
        => _memoryCache.TryGetValue<RecipeGetDto>(RECIPE_OF_THE_DAY_CACHE_KEY, out var recipe) ? recipe : null;
    
}
