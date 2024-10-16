using Microsoft.EntityFrameworkCore;
using Syncify.Web.Server.Data;
using Syncify.Web.Server.Features.Recipes;

namespace Syncify.Web.Server.Features.RecipeTags
{
    public interface IRecipeTagService
    {
        Task<Response<List<RecipeTagDto>>> GetTags();
        Task<Response<RecipeTagDto>> GetTagById(int id);
        Task<Response<RecipeTagDto>> CreateTag(RecipeTagCreateDto dto);
        Task<Response<RecipeTagDto>> UpdateTag(int id, RecipeTagCreateDto dto);
        Task<Response<bool>> DeleteTag(int id);
    }

    public class RecipeTagService : IRecipeTagService
    {
        private readonly DataContext _dataContext;

        public RecipeTagService(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public async Task<Response<List<RecipeTagDto>>> GetTags()
        {
            var tags = await _dataContext
                .Set<RecipeTag>()
                .Select(tag => new RecipeTagDto(tag.Id, tag.Name, tag.RecipeId))
                .ToListAsync();

            return tags.AsResponse();
        }

        public async Task<Response<RecipeTagDto>> GetTagById(int id)
        {
            var tag = await _dataContext
                .Set<RecipeTag>()
                .Where(tag => tag.Id == id)
                .Select(tag => new RecipeTagDto(tag.Id, tag.Name, tag.RecipeId))
                .FirstOrDefaultAsync();

            if (tag == null)
            {
                return Error.AsResponse<RecipeTagDto>("Tag not found", nameof(id));
            }

            return tag.AsResponse();
        }

        public async Task<Response<RecipeTagDto>> CreateTag(RecipeTagCreateDto dto)
        {
            var recipeExists = await _dataContext.Set<Recipe>().AnyAsync(r => r.Id == dto.RecipeId);
            if (!recipeExists)
            {
                return Error.AsResponse<RecipeTagDto>("The specified RecipeId does not exist.", nameof(dto.RecipeId));
            }

            try
            {
                var tag = new RecipeTag
                {
                    Name = dto.Name,
                    RecipeId = dto.RecipeId
                };

                _dataContext.Set<RecipeTag>().Add(tag);
                await _dataContext.SaveChangesAsync();

                var result = new RecipeTagDto(tag.Id, tag.Name, tag.RecipeId);
                return result.AsResponse();
            }
            catch (Exception)
            {
                return Error.AsResponse<RecipeTagDto>("An error occurred while creating the tag.");
            }
        }

    


    public async Task<Response<RecipeTagDto>> UpdateTag(int id, RecipeTagCreateDto dto)
        {
            var tag = await _dataContext.Set<RecipeTag>().FindAsync(id);
            if (tag == null)
            {
                return Error.AsResponse<RecipeTagDto>("Tag not found", nameof(id));
            }

            tag.Name = dto.Name;
            tag.RecipeId = dto.RecipeId;

            await _dataContext.SaveChangesAsync();

            var result = new RecipeTagDto(tag.Id, tag.Name, tag.RecipeId);
            return result.AsResponse();
        }

        public async Task<Response<bool>> DeleteTag(int id)
        {
            var tag = await _dataContext.Set<RecipeTag>().FindAsync(id);
            if (tag == null)
            {
                return Error.AsResponse<bool>("Tag not found", nameof(id));
            }

            _dataContext.Set<RecipeTag>().Remove(tag);
            await _dataContext.SaveChangesAsync();

            return true.AsResponse();
        }
    }
}
