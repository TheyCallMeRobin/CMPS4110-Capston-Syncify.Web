using Microsoft.EntityFrameworkCore;
using Syncify.Web.Server.Data;
using Syncify.Web.Server.Extensions;
using Syncify.Web.Server.Features.Families;

namespace Syncify.Web.Server.Features.FamilyRecipes;

public interface IFamilyRecipeService
{
    Task<Response<FamilyRecipeGetDto>> GetFamilyRecipeById(int id);
    Task<Response<List<FamilyRecipeGetDto>>> GetFamilyRecipesByFamilyId(int familyId);
    Task<Response<FamilyRecipeGetDto>> CreateFamilyRecipe(FamilyRecipeCreateDto createDto);
    Task<Response> RemoveRecipeFromFamily(int familyRecipeId);
}

public class FamilyRecipeService : IFamilyRecipeService
{
    private readonly DataContext _dataContext;

    public FamilyRecipeService(DataContext dataContext)
    {
        _dataContext = dataContext;
    }

    public async Task<Response<FamilyRecipeGetDto>> GetFamilyRecipeById(int id)
    {
        var familyRecipe = await _dataContext.Set<FamilyRecipe>().FirstOrDefaultAsync(x => x.Id == id);
        if (familyRecipe is null)
            return Error.AsResponse<FamilyRecipeGetDto>("Unable to find recipe for family.", nameof(id));

        return familyRecipe.MapTo<FamilyRecipeGetDto>().AsResponse();
    }

    public async Task<Response<List<FamilyRecipeGetDto>>> GetFamilyRecipesByFamilyId(int familyId)
    {
        var recipes = await _dataContext
            .Set<FamilyRecipe>()
            .Where(x => x.FamilyId == familyId)
            .ProjectTo<FamilyRecipeGetDto>()
            .ToListAsync();

        return recipes.AsResponse();
    }

    public async Task<Response<FamilyRecipeGetDto>> CreateFamilyRecipe(FamilyRecipeCreateDto createDto)
    {
        var family = await _dataContext.Set<Family>().FindAsync(createDto.FamilyId);
        if (family is null)
            return Error.AsResponse<FamilyRecipeGetDto>("The family could not be found.", nameof(createDto.FamilyId));
        
        var existingRecipe = await _dataContext
            .Set<FamilyRecipe>()
            .FirstOrDefaultAsync(x => x.FamilyId == createDto.FamilyId && x.RecipeId == createDto.RecipeId);

        if (existingRecipe is not null)
            return Error.AsResponse<FamilyRecipeGetDto>("This recipe already exists for this family", 
                nameof(createDto.RecipeId));

        var familyRecipe = createDto.MapTo<FamilyRecipe>();

        _dataContext.Set<FamilyRecipe>().Add(familyRecipe);
        await _dataContext.SaveChangesAsync();

        return familyRecipe.MapTo<FamilyRecipeGetDto>().AsResponse();
    }

    public async Task<Response> RemoveRecipeFromFamily(int familyRecipeId)
    {
        var familyRecipe = await _dataContext.Set<FamilyRecipe>().FirstOrDefaultAsync(x => x.Id == familyRecipeId);
        if (familyRecipe is null)
            return Error.AsResponse("Family Recipe not found.", nameof(familyRecipeId));

        _dataContext.Set<FamilyRecipe>().Remove(familyRecipe);
        await _dataContext.SaveChangesAsync();

        return Response.Success();
    }
}
