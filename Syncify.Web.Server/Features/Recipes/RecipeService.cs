using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Syncify.Web.Server.Data;
using Syncify.Web.Server.Extensions;
using Syncify.Web.Server.Features.RecipeIngredients;
using Syncify.Web.Server.Features.RecipeTags;

namespace Syncify.Web.Server.Features.Recipes
{
    public interface IRecipeService
    {
        Task<Response<List<RecipeGetDto>>> GetFilteredRecipes(int userId, RecipeQueryParams queryParams);
        Task<Response<List<RecipeGetDto>>> GetRecipesByUser(int userId);
        Task<Response<RecipeGetDto>> GetRecipeById(int id);
        Task<Response<RecipeGetDto>> CreateRecipe(RecipeCreateDto createDto, int userId);  // This is the correct CreateRecipe method
        Task<Response<RecipeGetDto>> UpdateRecipe(int id, RecipeCreateDto updateDto, int userId);
        Task<Response<bool>> DeleteRecipe(int id);
    }

    public class RecipeService : IRecipeService
    {
        private readonly DataContext _dataContext;
        private readonly IMapper _mapper;

        public RecipeService(DataContext dataContext, IMapper mapper)
        {
            _dataContext = dataContext;
            _mapper = mapper;
        }

        public async Task<Response<List<RecipeGetDto>>> GetFilteredRecipes(int userId, RecipeQueryParams queryParams)
        {
            var query = _dataContext.Set<Recipe>()
                .Include(x => x.Tags)
                .Include(x => x.RecipeIngredients)
                .Include(x => x.User)
                .Where(x => x.UserId == userId)
                .AsSplitQuery()
                .AsQueryable();

            if (!string.IsNullOrEmpty(queryParams.Name) || !string.IsNullOrEmpty(queryParams.Description))
            {
                query = query.Where(x =>
                    (!string.IsNullOrEmpty(queryParams.Name) && x.Name.Contains(queryParams.Name)) ||
                    (!string.IsNullOrEmpty(queryParams.Description) && x.Description.Contains(queryParams.Description))
                );
            }
            if (queryParams.PrepTime.HasValue && queryParams.PrepTime.Value > 0)
                query = query.Where(x => x.PrepTimeInMinutes == queryParams.PrepTime.Value);
            if (queryParams.CookTime.HasValue && queryParams.CookTime.Value > 0)
                query = query.Where(x => x.CookTimeInMinutes == queryParams.CookTime.Value);
            if (queryParams.Servings.HasValue && queryParams.Servings.Value > 0)
                query = query.Where(x => x.Servings == queryParams.Servings.Value);

            var data = await query.ProjectTo<RecipeGetDto>(_mapper.ConfigurationProvider).ToListAsync();
            return data.AsResponse();
        }

        public async Task<Response<List<RecipeGetDto>>> GetRecipesByUser(int userId)
        {
            var data = await _dataContext.Set<Recipe>()
                .Where(x => x.UserId == userId)
                .Include(x => x.Tags)
                .Include(x => x.RecipeIngredients)
                .Include(x => x.User)
                .AsSplitQuery()
                .ProjectTo<RecipeGetDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            return data.AsResponse();
        }

        public async Task<Response<RecipeGetDto>> GetRecipeById(int id)
        {
            var recipe = await _dataContext.Set<Recipe>()
                .Include(x => x.Tags)
                .Include(x => x.RecipeIngredients)
                .Include(x => x.User)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (recipe == null)
            {
                return Error.AsResponse<RecipeGetDto>("Unable to find recipe.", nameof(id));
            }

            return _mapper.Map<RecipeGetDto>(recipe).AsResponse();
        }

        public async Task<Response<RecipeGetDto>> CreateRecipe(RecipeCreateDto createDto, int userId)
        {
            if (await RecipeHasSameName(createDto.Name))
            {
                return Error.AsResponse<RecipeGetDto>("A recipe with this name already exists.", nameof(createDto.Name));
            }

            var recipe = _mapper.Map<Recipe>(createDto);
            recipe.UserId = userId;

            recipe.RecipeIngredients = _mapper.Map<List<RecipeIngredient>>(createDto.Ingredients);
            recipe.Tags = _mapper.Map<List<RecipeTag>>(createDto.Tags);

            _dataContext.Set<Recipe>().Add(recipe);
            await _dataContext.SaveChangesAsync();

            return _mapper.Map<RecipeGetDto>(recipe).AsResponse();
        }

        public async Task<Response<bool>> DeleteRecipe(int id)
        {
            var recipe = await _dataContext.Set<Recipe>().FindAsync(id);

            if (recipe == null)
            {
                return Error.AsResponse<bool>("Recipe not found.", nameof(id));
            }

            _dataContext.Set<Recipe>().Remove(recipe);
            await _dataContext.SaveChangesAsync();

            return true.AsResponse();
        }

        public async Task<Response<RecipeGetDto>> UpdateRecipe(int id, RecipeCreateDto updateDto, int userId)
        {
            var recipe = await _dataContext.Set<Recipe>()
                .Include(x => x.RecipeIngredients)
                .Include(r => r.Tags)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (recipe == null)
            {
                return Error.AsResponse<RecipeGetDto>("Recipe not found.", nameof(id));
            }

            if (recipe.UserId != userId)
            {
                return Error.AsResponse<RecipeGetDto>("Unauthorized to update this recipe.", nameof(userId));
            }

            recipe.Name = updateDto.Name;
            recipe.Description = updateDto.Description;
            recipe.PrepTimeInMinutes = updateDto.PrepTimeInMinutes;
            recipe.CookTimeInMinutes = updateDto.CookTimeInMinutes;
            recipe.Servings = updateDto.Servings;

            recipe.RecipeIngredients.Clear();
            recipe.Tags.Clear();

            var updatedIngredients = _mapper.Map<List<RecipeIngredient>>(updateDto.Ingredients);
            var updatedTags = _mapper.Map<List<RecipeTag>>(updateDto.Tags);

            recipe.RecipeIngredients.AddRange(updatedIngredients);
            recipe.Tags.AddRange(updatedTags);

            _dataContext.Set<Recipe>().Update(recipe);
            await _dataContext.SaveChangesAsync();

            return _mapper.Map<RecipeGetDto>(recipe).AsResponse();
        }

        private Task<bool> RecipeHasSameName(string name)
        {
            return _dataContext.Set<Recipe>().AnyAsync(x => x.Name.ToLower().Equals(name.ToLower()));
        }
    }

    public class RecipeQueryParams
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public int? PrepTime { get; set; }
        public int? CookTime { get; set; }
        public int? Servings { get; set; }
    }
}