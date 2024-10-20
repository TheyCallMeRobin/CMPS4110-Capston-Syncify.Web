using Microsoft.EntityFrameworkCore;
using Syncify.Common;
using Syncify.Common.Errors;
using Syncify.Common.Extensions;
using Syncify.Web.Server.Data;
using Syncify.Web.Server.Extensions;
using Syncify.Web.Server.Features.RecipeIngredients;
using Syncify.Web.Server.Features.RecipeTags;

namespace Syncify.Web.Server.Features.Recipes
{
    public interface IRecipeService
    {
        Task<Response<List<RecipeGetDto>>> GetFilteredRecipes(int userId, string? name, string? description, int? prepTime, int? cookTime, int? servings);
        Task<Response<List<RecipeGetDto>>> GetRecipesByUser(int userId);
        Task<Response<RecipeGetDto>> GetRecipeById(int id);
        Task<Response<RecipeGetDto>> CreateRecipe(RecipeCreateDto createDto, int userId);
        Task<Response<RecipeGetDto>> UpdateRecipe(int id, RecipeCreateDto updateDto, int userId);
        Task DeleteRecipe(int id);
    }

    public class RecipeService : IRecipeService
    {
        private readonly DataContext _dataContext;

        public RecipeService(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public async Task<Response<List<RecipeGetDto>>> GetFilteredRecipes(
            int userId,
            string? name = null,
            string? description = null,
            int? prepTime = null,
            int? cookTime = null,
            int? servings = null)
        {
            var query = _dataContext.Set<Recipe>()
                .Include(x => x.Tags)
                .Include(x => x.Ingredients)
                .Include(x => x.User)
                .Where(x => x.UserId == userId)
                .AsSplitQuery() // Split query applied here
                .AsQueryable();

            if (!string.IsNullOrEmpty(name) || !string.IsNullOrEmpty(description))
            {
                query = query.Where(x =>
                    (!string.IsNullOrEmpty(name) && x.Name.Contains(name)) ||
                    (!string.IsNullOrEmpty(description) && x.Description.Contains(description))
                );
            }
            if (prepTime.HasValue && prepTime.Value > 0) query = query.Where(x => x.PrepTimeInMinutes == prepTime.Value);
            if (cookTime.HasValue && cookTime.Value > 0) query = query.Where(x => x.CookTimeInMinutes == cookTime.Value);
            if (servings.HasValue && servings.Value > 0) query = query.Where(x => x.Servings == servings.Value);

            var data = await query.Select(x => x.MapTo<RecipeGetDto>()).ToListAsync();
            return data.AsResponse();
        }

        public async Task<Response<List<RecipeGetDto>>> GetRecipesByUser(int userId)
        {
            var data = await _dataContext.Set<Recipe>()
                .Where(x => x.UserId == userId)
                .Include(x => x.Tags)
                .Include(x => x.Ingredients)
                .Include(x => x.User)
                .AsSplitQuery() // Split query applied here
                .Select(x => x.MapTo<RecipeGetDto>())
                .ToListAsync();

            return data.AsResponse();
        }

        public async Task<Response<RecipeGetDto>> GetRecipeById(int id)
        {
            var data = await _dataContext.Set<Recipe>()
                .Include(x => x.Tags)
                .Include(x => x.Ingredients)
                .Include(x => x.User)
                .AsSplitQuery() // Split query applied here
                .FirstOrDefaultAsync(x => x.Id == id);

            if (data == null)
                return Error.AsResponse<RecipeGetDto>("Unable to find recipe.", nameof(id));

            return data.MapTo<RecipeGetDto>().AsResponse();
        }

        public async Task<Response<RecipeGetDto>> CreateRecipe(RecipeCreateDto createDto, int userId)
        {
            if (await RecipeHasSameName(createDto.Name))
                return Error.AsResponse<RecipeGetDto>("A recipe with this name already exists.", nameof(createDto.Name));

            var recipe = createDto.MapTo<Recipe>();
            recipe.UserId = userId;

            var ingredients = createDto.Ingredients.Select(i => new RecipeIngredient
            {
                Name = i.Name,
                Unit = i.Unit,
                Description = i.Description,
                Quantity = i.Quantity,
                Recipe = recipe
            }).ToList();

            recipe.Ingredients = ingredients;

            var tags = createDto.Tags.Select(t => new RecipeTag
            {
                Name = t.Name,
                Recipe = recipe
            }).ToList();

            recipe.Tags = tags;

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

        public async Task<Response<RecipeGetDto>> UpdateRecipe(int id, RecipeCreateDto updateDto, int userId)
        {
            var recipe = await _dataContext.Set<Recipe>()
                .Include(r => r.Ingredients)
                .Include(r => r.Tags)
                .AsSplitQuery() // Split query applied here
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

            recipe.Ingredients.Clear();
            recipe.Tags.Clear();

            var updatedIngredients = updateDto.Ingredients.Select(i => new RecipeIngredient
            {
                Name = i.Name,
                Unit = i.Unit,
                Description = i.Description,
                Quantity = i.Quantity,
                Recipe = recipe
            }).ToList();

            recipe.Ingredients.AddRange(updatedIngredients);

            var updatedTags = updateDto.Tags.Select(t => new RecipeTag
            {
                Name = t.Name,
                Recipe = recipe
            }).ToList();

            recipe.Tags.AddRange(updatedTags);

            _dataContext.Set<Recipe>().Update(recipe);
            await _dataContext.SaveChangesAsync();

            return recipe.MapTo<RecipeGetDto>().AsResponse();
        }

        private Task<bool> RecipeHasSameName(string name)
        {
            return _dataContext.Set<Recipe>().AnyAsync(x => x.Name.ToLower().Equals(name.ToLower()));
        }
    }
}
