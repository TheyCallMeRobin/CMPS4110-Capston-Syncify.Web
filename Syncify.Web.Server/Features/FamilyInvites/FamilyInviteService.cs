using Microsoft.EntityFrameworkCore;
using Syncify.Web.Server.Data;
using Syncify.Web.Server.Extensions;
using Syncify.Web.Server.Features.Authorization;
using Syncify.Web.Server.Features.Families;
using Syncify.Web.Server.Features.FamilyMembers;

namespace Syncify.Web.Server.Features.FamilyInvites;

public interface IFamilyInviteService
{
    Task<Response<FamilyInviteGetDto>> CreateInviteAsync(FamilyInviteCreateDto dto, CreateFamilyInviteQuery query);
    Task<Response<FamilyInviteGetDto>> ChangeInviteStatusAsync(ChangeInviteStatusDto dto);
    Task<Response<List<FamilyInviteGetDto>>> GetInvitesByUserId(int userId);
    Task<Response<List<FamilyInviteGetDto>>> GetInvitesByFamilyId(int familyId);
}

public class FamilyInviteService : IFamilyInviteService
{
    private readonly DataContext _dataContext;

    public FamilyInviteService(DataContext dataContext)
    {
        _dataContext = dataContext;
    }

    public async Task<Response<FamilyInviteGetDto>> CreateInviteAsync(FamilyInviteCreateDto dto, CreateFamilyInviteQuery query)
    {
        var family = await _dataContext.Set<Family>().FindAsync(dto.FamilyId);
        if (family is null)
            return Error.AsResponse<FamilyInviteGetDto>("The family could not be found.", nameof(query));

        
        var userToInvite = await FindUserFromQuery(query);
        if (userToInvite is null)
            return Error.AsResponse<FamilyInviteGetDto>("The user to invite could not be found.", nameof(query));

        var invite = dto.MapTo<FamilyInvite>();

        invite.UserId = userToInvite.Id;
        invite.CreatedOn = DateTime.UtcNow;

        _dataContext.Set<FamilyInvite>().Add(invite);
        await _dataContext.SaveChangesAsync();

        return invite.MapTo<FamilyInviteGetDto>().AsResponse();
    }
    
    public async Task<Response<FamilyInviteGetDto>> ChangeInviteStatusAsync(ChangeInviteStatusDto dto)
    {
        var invite = await _dataContext.Set<FamilyInvite>().FirstOrDefaultAsync(x => x.Id == dto.Id);
        if (invite is null)
            return Error.AsResponse<FamilyInviteGetDto>("Invite not found");

        await using var transaction = await _dataContext.Database.BeginTransactionAsync();
        
        invite.Status = dto.Status;
        
        await _dataContext.SaveChangesAsync();

        if (dto.Status == InviteStatus.Accepted)
        {
            var familyMember = new FamilyMember
            {
                FamilyId = invite.FamilyId,
                UserId = invite.UserId,
            };
            _dataContext.Set<FamilyMember>().Add(familyMember);
            await _dataContext.SaveChangesAsync();
        }

        await _dataContext.SaveChangesAsync();
        await transaction.CommitAsync();
        
        return invite.MapTo<FamilyInviteGetDto>().AsResponse();
    }

    public async Task<Response<List<FamilyInviteGetDto>>> GetInvitesByUserId(int userId)
    {
        var invites = await _dataContext
            .Set<FamilyInvite>()
            .Where(x => x.UserId == userId)
            .ProjectTo<FamilyInviteGetDto>()
            .ToListAsync();

        return invites.AsResponse();
    }

    public async Task<Response<List<FamilyInviteGetDto>>> GetInvitesByFamilyId(int familyId)
    {
        var invites = await _dataContext
            .Set<FamilyInvite>()
            .Where(x => x.FamilyId == familyId)
            .ProjectTo<FamilyInviteGetDto>()
            .ToListAsync();

        return invites.AsResponse();
    }

    private Task<User?> FindUserFromQuery(CreateFamilyInviteQuery query)
    {
       return _dataContext
            .Set<User>()
            .FirstOrDefaultAsync(x => string.IsNullOrWhiteSpace(query.MemberIdentifier) ||
                                    x.MemberIdentifier.ToString().Equals(query.MemberIdentifier) &&
                                    string.IsNullOrWhiteSpace(query.Email) ||
                                    x.Email.Equals(query.Email) &&
                                    string.IsNullOrWhiteSpace(query.PhoneNumber) ||
                                    x.PhoneNumber.Equals(query.PhoneNumber));
    }
}