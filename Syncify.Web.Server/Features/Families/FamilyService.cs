﻿using Microsoft.EntityFrameworkCore;
using Syncify.Common.DataClasses;
using Syncify.Web.Server.Data;
using Syncify.Web.Server.Exceptions;
using Syncify.Web.Server.Extensions;
using Syncify.Web.Server.Features.FamilyMembers;

namespace Syncify.Web.Server.Features.Families;

public interface IFamilyService
{
    Task<Response<FamilyGetDto>> CreateFamily(FamilyCreateDto dto);
    Task<Response<List<FamilyGetDto>>> GetAllFamilies();
    Task<Response<List<FamilyGetDto>>> GetFamiliesByUserId(int userId);
    Task<Response<List<OptionDto>>> GetFamilyOptionsForUser(int userId); 
    Task<Response<FamilyGetDto>> GetFamilyById(int id);
    Task<Response<FamilyGetDto>> UpdateFamily(int id, FamilyUpdateDto dto, int requestingUserId);
    Task<Response> DeleteFamily(int id, int requestingUserId);

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

        await using var transaciton = await _dataContext.Database.BeginTransactionAsync();
        
        var family = dto.MapTo<Family>();
        
        _dataContext.Set<Family>().Add(family);
        await _dataContext.SaveChangesAsync();

        var familyMember = new FamilyMember
        {
            UserId = dto.CreatedByUserId,
            FamilyId = family.Id,
            Role = FamilyMemberRole.Owner
        };

        _dataContext.Set<FamilyMember>().Add(familyMember);
        await _dataContext.SaveChangesAsync();
        
        await transaciton.CommitAsync();
        
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

    public async Task<Response<List<OptionDto>>> GetFamilyOptionsForUser(int userId)
    {
        var data = await _dataContext
            .Set<Family>()
            .Include(x => x.FamilyMembers)
            .Where(x => x.CreatedByUserId == userId || x.FamilyMembers.Any(fm => fm.UserId == userId))
            .Select(x => new OptionDto(x.Name, x.Id))
            .ToListAsync();

        return data.AsResponse();
    }

    public async Task<Response<FamilyGetDto>> GetFamilyById(int id)
    {
        var family = await _dataContext.Set<Family>().FirstOrDefaultAsync(x => x.Id == id);
        if (family is null)
            return Error.AsResponse<FamilyGetDto>("Family not found.", nameof(family.Id));

        return family.MapTo<FamilyGetDto>().AsResponse();
    }

    public async Task<Response<FamilyGetDto>> UpdateFamily(int id, FamilyUpdateDto dto, int requestingUserId)
    {
        var family = await _dataContext
            .Set<Family>()
            .Include(x => x.FamilyMembers.Where(fm => fm.UserId == requestingUserId))
            .FirstOrDefaultAsync(x => x.Id == id);
        
        if (family is null)
            return Error.AsResponse<FamilyGetDto>("Family not found.", nameof(family.Id));

        var requestingUserFamilyMember = family.FamilyMembers.FirstOrDefault();
        if (requestingUserFamilyMember is not { Role: FamilyMemberRole.Owner })
        {
            throw new NotAuthorizedException("Insufficient permissions to edit this family");
        }
        
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

    public async Task<Response> DeleteFamily(int id, int requestingUserId)
    {
        var family = await _dataContext
            .Set<Family>()
            .Include(x => x.FamilyMembers.Where(fm => fm.UserId == requestingUserId))
            .FirstOrDefaultAsync(x => x.Id == id);
        
        if (family is null)
            return Error.AsResponse("Family not found.", nameof(family.Id));

        var member = family.FamilyMembers.FirstOrDefault();
        if (member is not { Role: FamilyMemberRole.Owner })
            throw new NotAuthorizedException("Insufficient permission to delete this family.");
        
        _dataContext.Set<Family>().Remove(family);
        await _dataContext.SaveChangesAsync();

        return Response.Success();
    }

    private Task<bool> IsNotUnique(FamilyCreateDto dto)
        => _dataContext.Set<Family>()
            .AnyAsync(x => x.Name.ToLower().Equals(dto.Name.ToLower()) && 
                           x.CreatedByUserId == dto.CreatedByUserId);
}