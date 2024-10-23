using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Syncify.Common;
using Syncify.Common.Errors;
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
        private readonly IMapper _mapper;

        public RecipeTagService(DataContext dataContext, IMapper mapper)
        {
            _dataContext = dataContext;
            _mapper = mapper;

            // Ensure mapping configurations
            var config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<RecipeTag, RecipeTagDto>();
                cfg.CreateMap<RecipeTagCreateDto, RecipeTag>();
            });

            _mapper = config.CreateMapper();
        }

        public async Task<Response<List<RecipeTagDto>>> GetTags()
        {
            var tags = await _dataContext.Set<RecipeTag>()
                .ProjectTo<RecipeTagDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            return tags.AsResponse();
        }

        public async Task<Response<RecipeTagDto>> GetTagById(int id)
        {
            var tag = await _dataContext.Set<RecipeTag>()
                .ProjectTo<RecipeTagDto>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(x => x.Id == id);

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

            var tag = _mapper.Map<RecipeTag>(dto);
            _dataContext.Set<RecipeTag>().Add(tag);
            await _dataContext.SaveChangesAsync();

            return _mapper.Map<RecipeTagDto>(tag).AsResponse();
        }

        public async Task<Response<RecipeTagDto>> UpdateTag(int id, RecipeTagCreateDto dto)
        {
            var tag = await _dataContext.Set<RecipeTag>().FindAsync(id);
            if (tag == null)
            {
                return Error.AsResponse<RecipeTagDto>("Tag not found", nameof(id));
            }

            _mapper.Map(dto, tag);
            await _dataContext.SaveChangesAsync();

            return _mapper.Map<RecipeTagDto>(tag).AsResponse();
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