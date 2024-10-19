using Microsoft.EntityFrameworkCore;
using Syncify.Common.Constants;
using Syncify.Web.Server.Data;
using Syncify.Web.Server.Extensions;

namespace Syncify.Web.Server.Features.RecipeIngredients;

public interface IRecipeIngredientService
{
    Task<Response<RecipeIngredientGetDto>> CreateRecipeIngredient(RecipeIngredientCreateDto dto);
    Task<List<RecipeIngredientGetDto>> GetAllIngredients(int recipeId);
    Task<Response<RecipeIngredientGetDto>> GetById(int id);
    Task<Response<RecipeIngredientGetDto>> UpdateRecipeIngredient(int id, RecipeIngredientUpdateDto dto);
    Task<Response> DeleteRecipeIngredient(int id);
}

public class RecipeIngredientService : IRecipeIngredientService
{

    private readonly DataContext _dataContext;

    public RecipeIngredientService(DataContext dataContext)
    {
        _dataContext = dataContext;
    }

    public async Task<Response<RecipeIngredientGetDto>> CreateRecipeIngredient(RecipeIngredientCreateDto dto)
    {
        if (await IngredientAlreadyExists(dto.RecipeId, dto.Name))
            return Error.AsResponse<RecipeIngredientGetDto>("An ingredient with this name already exists for this recipe",
                nameof(dto.Name));

        var ingredient = dto.MapTo<RecipeIngredient>();

        _dataContext.Set<RecipeIngredient>().Add(ingredient);
        await _dataContext.SaveChangesAsync();

        return ingredient.MapTo<RecipeIngredientGetDto>().AsResponse();
    }

    public Task<List<RecipeIngredientGetDto>> GetAllIngredients(int recipeId)
    {
        return _dataContext
            .Set<RecipeIngredient>()
            .Where(x => x.RecipeId == recipeId)
            .ProjectTo<RecipeIngredientGetDto>()
            .ToListAsync();
    }

    public async Task<Response<RecipeIngredientGetDto>> GetById(int id)
    {
        var ingredient = await _dataContext.Set<RecipeIngredientGetDto>().FindAsync(id);
        if (ingredient is null)
            return Error.AsResponse<RecipeIngredientGetDto>(ErrorMessages.NotFoundError, nameof(id));

        return ingredient.MapTo<RecipeIngredientGetDto>().AsResponse();
    }

    public async Task<Response<RecipeIngredientGetDto>> UpdateRecipeIngredient(int id, RecipeIngredientUpdateDto dto)
    {
        var ingredient = await _dataContext.Set<RecipeIngredient>().FindAsync(id);
        if (ingredient is null)
            return Error.AsResponse<RecipeIngredientGetDto>(ErrorMessages.NotFoundError, nameof(id));

        if (await IngredientAlreadyExists(ingredient.RecipeId, ingredient.Name))
            return Error.AsResponse<RecipeIngredientGetDto>(ErrorMessages.NotFoundError, nameof(id));

        ingredient.Name = dto.Name;
        ingredient.Description = dto.Description;
        ingredient.Quantity = dto.Quantity;
        ingredient.Unit = dto.Unit;

        await _dataContext.SaveChangesAsync();
        return ingredient.MapTo<RecipeIngredientGetDto>().AsResponse();
    }

    public async Task<Response> DeleteRecipeIngredient(int id)
    {
        var ingredient = await _dataContext.Set<RecipeIngredient>().FindAsync(id);
        if (ingredient is null)
            return Error.AsResponse<RecipeIngredientGetDto>(ErrorMessages.NotFoundError, nameof(id));

        _dataContext.Set<RecipeIngredient>().Remove(ingredient);
        await _dataContext.SaveChangesAsync();

        return Response.Success();
    }

    private Task<bool> IngredientAlreadyExists(int recipeId, string name)
        => _dataContext.Set<RecipeIngredient>()
            .AnyAsync(x => x.RecipeId == recipeId && x.Name.ToLower().Equals(name.ToLower()));
}