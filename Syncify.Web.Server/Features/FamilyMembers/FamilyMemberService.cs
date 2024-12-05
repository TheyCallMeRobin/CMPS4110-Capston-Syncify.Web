using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Syncify.Web.Server.Data;
using Syncify.Web.Server.Exceptions;
using Syncify.Web.Server.Extensions;
using Syncify.Web.Server.Features.FamilyInvites;

namespace Syncify.Web.Server.Features.FamilyMembers;

public interface IFamilyMemberService
{
    Task<Response<List<FamilyMemberGetDto>>> GetFamilyMembers(int familyId);
    Task<Response> RemoveFamilyMember(int familyMemberId, int requestingUserId);
}

public class FamilyMemberService : IFamilyMemberService
{
    private readonly DataContext _dataContext;

    public FamilyMemberService(DataContext dataContext)
    {
        _dataContext = dataContext;
    }

    public async Task<Response<List<FamilyMemberGetDto>>> GetFamilyMembers(int familyId)
    {
        var familyMembers = await _dataContext
            .Set<FamilyMember>()
            .Where(x => x.FamilyId == familyId)
            .ProjectTo<FamilyMemberGetDto>()
            .ToListAsync();

        return familyMembers.AsResponse();
    }

    public async Task<Response> RemoveFamilyMember(int familyMemberId, int requestingUserId)
    {
        var familyMember = await _dataContext.Set<FamilyMember>().FirstOrDefaultAsync(x => x.Id == familyMemberId);
        if (familyMember is null)
            return Error.AsResponse("Family member not found.", nameof(familyMemberId));
        
        var requestingUserFamilyMember = await _dataContext
            .Set<FamilyMember>()
            .FirstOrDefaultAsync(x => x.Id == requestingUserId);

        VerifyUserCanDelete(familyMember, requestingUserFamilyMember);
        
        _dataContext.Set<FamilyMember>().Remove(familyMember);
        await _dataContext.SaveChangesAsync();

        return Response.Success();
    }

    private void VerifyUserCanDelete(FamilyMember familyMember, FamilyMember? requestingUserFamilyMember)
    {
        if (requestingUserFamilyMember is not { Role: FamilyMemberRole.Admin } or {Role: FamilyMemberRole.Owner })
        {
            throw new NotAuthorizedException("Insufficient permissions to remove a family member.");
        }

        if (familyMember.Role is FamilyMemberRole.Owner or FamilyMemberRole.Admin)
        {
            throw new NotAuthorizedException("Insufficient permissions to remove this family member.");
        }
    }
}