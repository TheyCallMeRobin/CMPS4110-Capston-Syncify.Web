using Microsoft.EntityFrameworkCore;
using Syncify.Web.Server.Data;
using Syncify.Web.Server.Extensions;
using Syncify.Web.Server.Features.Calendars;
using Syncify.Web.Server.Features.Families;
using Syncify.Web.Server.Features.GroupCalendars;

namespace Syncify.Web.Server.Features.FamilyCalendars;

public interface IFamilyCalendarService
{
    Task<Response<FamilyCalendarGetDto>> AddCalendarToGroup(FamilyCalendarCreateDto dto);
    Task<Response> RemoveCalendarFromGroup(int groupCalendarId);

}

public class FamilyCalendarService : IFamilyCalendarService
{
    private readonly DataContext _dataContext;

    public FamilyCalendarService(DataContext dataContext)
    {
        _dataContext = dataContext;
    }
    
    public async Task<Response<FamilyCalendarGetDto>> AddCalendarToGroup(FamilyCalendarCreateDto dto)
    {
        var group = await _dataContext.Set<Family>().FindAsync(dto.GroupId);
        if (group is null)
            return Error.AsResponse<FamilyCalendarGetDto>("Group not found", nameof(dto.GroupId));

        var calendar = await _dataContext.Set<Calendar>().FindAsync(dto.CalendarId);
        if (calendar is null)
            return Error.AsResponse<FamilyCalendarGetDto>("Calendar not found.", nameof(dto.CalendarId));

        var groupCalendar = dto.MapTo<FamilyCalendar>();
        
        _dataContext.Set<FamilyCalendar>().Add(groupCalendar);
        await _dataContext.SaveChangesAsync();

        return groupCalendar.MapTo<FamilyCalendarGetDto>().AsResponse();
    }

    public async Task<Response> RemoveCalendarFromGroup(int groupCalendarId)
    {
        var groupCalendar = await _dataContext.Set<FamilyCalendar>().FirstOrDefaultAsync(x => x.Id == groupCalendarId);
        if (groupCalendar is null)
            return Error.AsResponse("Unable to find calendar in group.", nameof(groupCalendarId));

        _dataContext.Set<FamilyCalendar>().Remove(groupCalendar);
        return Response.Success();
    }
}