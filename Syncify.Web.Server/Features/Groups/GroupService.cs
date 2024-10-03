using Microsoft.EntityFrameworkCore;
using Syncify.Web.Server.Data;
using Syncify.Web.Server.Extensions;
using Syncify.Web.Server.Features.CalendarGroups;

namespace Syncify.Web.Server.Features.Groups;

public interface IGroupService
{
    Task<Response<GroupGetDto>> CreateGroup(GroupCreateDto dto);
    Task<Response<List<GroupGetDto>>> GetAllGroups();
    Task<Response<GroupGetDto>> GetGroupById(int id);
    Task<Response<GroupGetDto>> UpdateGroup(int id, GroupUpdateDto dto);
    Task<Response> DeleteGroup(int id);

    Task<Response<CalendarGroupGetDto>> AddCalendarToGroup(int groupId, int calendarId);
}

public class GroupService : IGroupService
{
    private readonly DataContext _dataContext;

    public GroupService(DataContext dataContext)
    {
        _dataContext = dataContext;
    }

    public async Task<Response<GroupGetDto>> CreateGroup(GroupCreateDto dto)
    {
        if (await IsNotUnique(dto))
            return Error.AsResponse<GroupGetDto>("There is already a group with this name for this user",
                nameof(dto.Name));

        var group = dto.MapTo<Group>();
        group.Identifier = GenerateIdentitfier();

        _dataContext.Set<Group>().Add(group);
        await _dataContext.SaveChangesAsync();

        return group.MapTo<GroupGetDto>().AsResponse();
    }

    public async Task<Response<List<GroupGetDto>>> GetAllGroups()
    {
        var groups = await _dataContext.Set<Group>()
            .ProjectTo<GroupGetDto>()
            .ToListAsync();

        return groups.AsResponse();
    }

    public async Task<Response<GroupGetDto>> GetGroupById(int id)
    {
        var group = await _dataContext.Set<Group>().FirstOrDefaultAsync(x => x.Id == id);
        if (group is null)
            return Error.AsResponse<GroupGetDto>("Group not found.", nameof(group.Id));

        return group.MapTo<GroupGetDto>().AsResponse();
    }

    public async Task<Response<GroupGetDto>> UpdateGroup(int id, GroupUpdateDto dto)
    {
        var group = await _dataContext.Set<Group>().FirstOrDefaultAsync(x => x.Id == id);
        if (group is null)
            return Error.AsResponse<GroupGetDto>("Group not found.", nameof(group.Id));

        if (dto.Name.ToLower().Equals(group.Name.ToLower()))
            return group.MapTo<GroupGetDto>().AsResponse();

        var isNotUnique = await _dataContext.Set<Group>()
            .AnyAsync(x => 
                x.Name.ToLower().Equals(dto.Name.ToLower()) && 
                x.CreatedByUserId == group.CreatedByUserId &&
                x.Id != group.Id);

        if (isNotUnique)
            return Error.AsResponse<GroupGetDto>("There is already a group with this name for this user",
                nameof(dto.Name));

        group.Name = dto.Name;
        await _dataContext.SaveChangesAsync();
        
        return group.MapTo<GroupGetDto>().AsResponse();
    }

    public async Task<Response> DeleteGroup(int id)
    {
        var group = await _dataContext.Set<Group>().FirstOrDefaultAsync(x => x.Id == id);
        if (group is null)
            return Error.AsResponse("Group not found.", nameof(group.Id));

        _dataContext.Set<Group>().Remove(group);
        await _dataContext.SaveChangesAsync();

        return Response.Success();
    }

    public Task<Response<CalendarGroupGetDto>> AddCalendarToGroup(int groupId, int calendarId)
    {
        
    }

    private Task<bool> IsNotUnique(GroupCreateDto dto)
        => _dataContext.Set<Group>()
            .AnyAsync(x => x.Name.ToLower().Equals(dto.Name.ToLower()) && 
                           x.CreatedByUserId == dto.CreatedByUserId);
    
    private string GenerateIdentitfier()
        => Guid.NewGuid().ToString();
}