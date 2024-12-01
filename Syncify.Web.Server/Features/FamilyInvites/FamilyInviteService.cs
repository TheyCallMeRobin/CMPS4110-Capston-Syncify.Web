using Microsoft.EntityFrameworkCore;
using Syncify.Web.Server.Data;
using Syncify.Web.Server.Extensions;
using Syncify.Web.Server.Features.Authorization;
using Syncify.Web.Server.Features.Families;
using Syncify.Web.Server.Features.FamilyMembers;

namespace Syncify.Web.Server.Features.FamilyInvites;

public interface IFamilyInviteService
{
    Task<Response<FamilyInviteGetDto>> CreateInviteAsync(FamilyInviteCreateDto dto);
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

    public async Task<Response<FamilyInviteGetDto>> CreateInviteAsync(FamilyInviteCreateDto dto)
    {
        var family = await _dataContext.Set<Family>().FindAsync(dto.FamilyId);
        if (family is null)
            return Error.AsResponse<FamilyInviteGetDto>("The family could not be found.", nameof(dto.FamilyId));

        var user = await _dataContext
            .Set<User>()
            .FirstOrDefaultAsync(x => x.Email.Equals(dto.InviteQuery)
                                      || x.PhoneNumber.Equals(dto.InviteQuery)
                                      || x.MemberIdentifier.ToString().Equals(dto.InviteQuery));

        if (user is null)
            return Error.AsResponse<FamilyInviteGetDto>("User not found", nameof(dto.InviteQuery));

        var existingMember = await _dataContext
            .Set<FamilyMember>()
            .FirstOrDefaultAsync(x => x.FamilyId == family.Id && x.UserId == user.Id);

        if (existingMember != null)
        {
            return Error.AsResponse<FamilyInviteGetDto>("This user is already a member of the family.");
        }

        var existingInvite = await _dataContext
            .Set<FamilyInvite>()
            .FirstOrDefaultAsync(x => x.FamilyId == family.Id && x.UserId == user.Id);

        if (existingInvite != null)
        {
            if (existingInvite.Status == InviteStatus.Declined || existingInvite.ExpiresOn < DateTime.UtcNow)
            {
                existingInvite.Status = InviteStatus.Pending;
                existingInvite.SentByUserId = dto.SentByUserId;
                existingInvite.ExpiresOn = dto.ExpiresOn;

                await _dataContext.SaveChangesAsync();
                return existingInvite.MapTo<FamilyInviteGetDto>().AsResponse();
            }

            if (existingInvite.Status == InviteStatus.Accepted)
            {
                existingInvite.Status = InviteStatus.Pending;
                existingInvite.SentByUserId = dto.SentByUserId;
                existingInvite.ExpiresOn = dto.ExpiresOn;

                await _dataContext.SaveChangesAsync();
                return existingInvite.MapTo<FamilyInviteGetDto>().AsResponse();
            }

            return Error.AsResponse<FamilyInviteGetDto>("This user has already been invited to this family.");
        }

        var familyInvite = new FamilyInvite
        {
            SentByUserId = dto.SentByUserId,
            FamilyId = dto.FamilyId,
            ExpiresOn = dto.ExpiresOn,
            UserId = user.Id,
        };

        _dataContext.Set<FamilyInvite>().Add(familyInvite);
        await _dataContext.SaveChangesAsync();

        return familyInvite.MapTo<FamilyInviteGetDto>().AsResponse();
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
            .Where(x => x.UserId == userId && x.Status == InviteStatus.Pending)
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
}