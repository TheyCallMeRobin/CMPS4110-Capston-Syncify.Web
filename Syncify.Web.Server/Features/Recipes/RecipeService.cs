using System.Linq.Expressions;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Syncify.Web.Server.Data;
using Syncify.Web.Server.Extensions;
using Syncify.Web.Server.Features.FamilyMembers;

namespace Syncify.Web.Server.Features.Recipes;

public interface IRecipeService
{
    Task<Response<List<RecipeGetDto>>> GetRecipes(RecipeQuery? query = null);
    Task<Response<RecipeGetDto>> GetRecipeById(int id);
    Task<Response<List<RecipeGetDto>>> GetRecipesByUserId(int userId);
    Task<Response<RecipeGetDto>> GetRecipeOfTheDay();
    Task<Response<RecipeGetDto>> UpdateRecipe(RecipeUpdateDto dto);
    Task<Response<RecipeGetDto>> CreateRecipe(RecipeCreateDto createDto);
    Task<Response> DeleteRecipe(int id);
}

public class RecipeService : IRecipeService
{
    private readonly DataContext _dataContext;
    private readonly IMemoryCache _memoryCache;
    private readonly IMapper _mapper;

    private const string RECIPE_OF_THE_DAY_CACHE_KEY = nameof(RECIPE_OF_THE_DAY_CACHE_KEY);
    
    public RecipeService(DataContext dataContext, IMemoryCache memoryCache, IMapper mapper)
    {
        _dataContext = dataContext;
        _memoryCache = memoryCache;
        _mapper = mapper;
    }

    public async Task<Response<List<RecipeGetDto>>> GetRecipes(RecipeQuery? query = null)
    {
        var filter = await BuildQuery(query);

        var data = await _dataContext
            .Set<Recipe>()
            .AsNoTracking()
            .Where(filter)
            .ProjectTo<RecipeGetDto>()
            .AsSplitQuery()
            .ToListAsync();

        return data.AsResponse();
    }

    public async Task<Response<RecipeGetDto>> GetRecipeById(int id)
    {
        var data = await _dataContext
            .Set<Recipe>()
            .Include(x => x.CreatedByUser)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (data is null)
            return Error.AsResponse<RecipeGetDto>("Unable to find recipe.", nameof(id));
        
        return MappingExtensions.MapTo<RecipeGetDto>(data).AsResponse();
    }

    public async Task<Response<List<RecipeGetDto>>> GetRecipesByUserId(int userId)
    {
        var data = await _dataContext
            .Set<Recipe>()
            .Where(x => x.CreatedByUserId == userId)
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

        _memoryCache.Set(RECIPE_OF_THE_DAY_CACHE_KEY, MappingExtensions.MapTo<RecipeGetDto>(data), DateTimeOffset.Now.AddHours(24));
        
        return MappingExtensions.MapTo<RecipeGetDto>(data).AsResponse();
    }

    public async Task<Response<RecipeGetDto>> UpdateRecipe(RecipeUpdateDto dto)
    {
        var recipe = await _dataContext.Set<Recipe>().FirstOrDefaultAsync(x => x.Id == dto.Id);
        if (recipe is null)
            return Error.AsResponse<RecipeGetDto>("Unable to find recipe.", nameof(dto.Id));

        if (await RecipeHasSameName(dto.Name))
            return Error.AsResponse<RecipeGetDto>("A recipe with this name already exists.", nameof(dto.Name));
        
        _mapper.Map(dto, recipe);
        await _dataContext.SaveChangesAsync();
        
        return MappingExtensions.MapTo<RecipeGetDto>(recipe).AsResponse();
    }

    public async Task<Response<RecipeGetDto>> CreateRecipe(RecipeCreateDto createDto)
    {
        if (await RecipeHasSameName(createDto.Name))
            return Error.AsResponse<RecipeGetDto>("A recipe with this name already exists.", nameof(createDto.Name));

        var recipe = MappingExtensions.MapTo<Recipe>(createDto);

        _dataContext.Set<Recipe>().Add(recipe);
        await _dataContext.SaveChangesAsync();

        return MappingExtensions.MapTo<RecipeGetDto>(recipe).AsResponse();
    }

    public Task<Response> DeleteRecipe(int id)
    {
        throw new NotImplementedException();
    }

    private Task<bool> RecipeHasSameName(string name)
        => _dataContext.Set<Recipe>().AnyAsync(x => x.Name.ToLower().Equals(name.ToLower()));

    private RecipeGetDto? GetCachedRecipeOfTheDay()
        => _memoryCache.TryGetValue<RecipeGetDto>(RECIPE_OF_THE_DAY_CACHE_KEY, out var recipe) ? recipe : null;

    private async Task<Expression<Func<Recipe, bool>>> BuildQuery(RecipeQuery? query)
    {
        var filter = PredicateBuilder.True<Recipe>();
        if (query is null) 
            return filter;
        
        var familyIds = await _dataContext.Set<FamilyMember>()
            .Where(x => x.UserId == query.CreatedByUserId)
            .Select(x => x.FamilyId)
            .ToListAsync();

        filter = filter
            .And(x => string.IsNullOrWhiteSpace(query.Name) || x.Name.ToLower().StartsWith(query.Name.ToLower()))
            .And(x => !query.CookTimeLowerBound.HasValue || x.CookTimeInSeconds.GetValueOrDefault(0) >= query.CookTimeLowerBound)
            .And(x => !query.CookTimeUpperBound.HasValue || x.CookTimeInSeconds.GetValueOrDefault(0) <= query.CookTimeUpperBound)
            .And(x => !query.PrepTimeLowerBound.HasValue || x.PrepTimeInSeconds.GetValueOrDefault(0) >= query.PrepTimeLowerBound)
            .And(x => !query.PrepTimeUpperBound.HasValue || x.PrepTimeInSeconds.GetValueOrDefault(0) <= query.PrepTimeUpperBound)
            .And(x => query.TagIds == null || query.TagIds.Count == 0 || x.RecipeTags.Any(tag => query.TagIds.Contains(tag.Id)))
            .And(x => query.CreatedByUserId.GetValueOrDefault(0) == 0 
                      || x.CreatedByUserId == query.CreatedByUserId!.Value 
                                                                 || x.FamilyRecipes.Any(fr => familyIds.Contains(fr.FamilyId)));

        return filter;
    }
    
}
