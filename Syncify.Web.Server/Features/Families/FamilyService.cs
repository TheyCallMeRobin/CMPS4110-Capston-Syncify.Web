using Microsoft.EntityFrameworkCore;
using Syncify.Web.Server.Data;
using Syncify.Web.Server.Extensions;
using Syncify.Web.Server.Features.FamilyMembers;

namespace Syncify.Web.Server.Features.Families;

public interface IFamilyService
{
    Task<Response<FamilyGetDto>> CreateFamily(FamilyCreateDto dto);
    Task<Response<List<FamilyGetDto>>> GetAllFamilies();
    Task<Response<List<FamilyGetDto>>> GetFamiliesByUserId(int userId);

    Task<Response<FamilyGetDto>> GetFamilyById(int id);
    Task<Response<FamilyGetDto>> UpdateFamily(int id, FamilyUpdateDto dto);
    Task<Response> DeleteFamily(int id);

}

public class FamilyService : IFamilyService
{
    private readonly DataContext _dataContext;

    public FamilyService(DataContext dataContext)
    {
        _dataContext = dataContext;
    }

    public async Task<Response<FamilyGetDto>> CreateFamily(FamilyCreateDto dto)
    {
        if (await IsNotUnique(dto))
            return Error.AsResponse<FamilyGetDto>("There is already a family with this name for this user",
                nameof(dto.Name));

        var family = dto.MapTo<Family>();

        _dataContext.Set<Family>().Add(family);
        await _dataContext.SaveChangesAsync();

        return family.MapTo<FamilyGetDto>().AsResponse();
    }

    public async Task<Response<List<FamilyGetDto>>> GetAllFamilies()
    {
        var familys = await _dataContext.Set<Family>()
            .ProjectTo<FamilyGetDto>()
            .ToListAsync();

        return familys.AsResponse();
    }

    public async Task<Response<List<FamilyGetDto>>> GetFamiliesByUserId(int userId)
    {
        var families = await _dataContext
            .Set<Family>()
            .Where(x => x.FamilyMembers.Any(fm => fm.UserId == userId))
            .ProjectTo<FamilyGetDto>()
            .ToListAsync();

        return families.AsResponse();
    }

    public async Task<Response<FamilyGetDto>> GetFamilyById(int id)
    {
        var family = await _dataContext.Set<Family>().FirstOrDefaultAsync(x => x.Id == id);
        if (family is null)
            return Error.AsResponse<FamilyGetDto>("Family not found.", nameof(family.Id));

        return family.MapTo<FamilyGetDto>().AsResponse();
    }

    public async Task<Response<FamilyGetDto>> UpdateFamily(int id, FamilyUpdateDto dto)
    {
        var family = await _dataContext.Set<Family>().FirstOrDefaultAsync(x => x.Id == id);
        if (family is null)
            return Error.AsResponse<FamilyGetDto>("Family not found.", nameof(family.Id));

        if (dto.Name.ToLower().Equals(family.Name.ToLower()))
            return family.MapTo<FamilyGetDto>().AsResponse();

        var isNotUnique = await _dataContext.Set<Family>()
            .AnyAsync(x => 
                x.Name.ToLower().Equals(dto.Name.ToLower()) && 
                x.CreatedByUserId == family.CreatedByUserId &&
                x.Id != family.Id);

        if (isNotUnique)
            return Error.AsResponse<FamilyGetDto>("There is already a family with this name for this user",
                nameof(dto.Name));

        family.Name = dto.Name;
        await _dataContext.SaveChangesAsync();
        
        return family.MapTo<FamilyGetDto>().AsResponse();
    }

    public async Task<Response> DeleteFamily(int id)
    {
        var family = await _dataContext.Set<Family>().FirstOrDefaultAsync(x => x.Id == id);
        if (family is null)
            return Error.AsResponse("Family not found.", nameof(family.Id));

        _dataContext.Set<Family>().Remove(family);
        await _dataContext.SaveChangesAsync();

        return Response.Success();
    }

    private Task<bool> IsNotUnique(FamilyCreateDto dto)
        => _dataContext.Set<Family>()
            .AnyAsync(x => x.Name.ToLower().Equals(dto.Name.ToLower()) && 
                           x.CreatedByUserId == dto.CreatedByUserId);
}