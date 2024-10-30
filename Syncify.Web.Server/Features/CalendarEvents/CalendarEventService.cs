using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Syncify.Common.Constants;
using Syncify.Web.Server.Data;
using Syncify.Web.Server.Extensions;

namespace Syncify.Web.Server.Features.CalendarEvents;

public interface ICalendarEventService
{
    Task<Response<List<CalendarEventGetDto>>> GetCalendarEventsAsync(int calendarId);
    Task<Response<List<CalendarEventGetDto>>> GetCalendarEventsFromCalendars(IEnumerable<int> calendarsIds);
    Task<Response<CalendarEventGetDto>> GetCalendarEventByIdAsync(int id);
    Task<Response<List<CalendarEventGetDto>>> GetUpcomingEventsByUserId(int userId);
    Task<Response<List<CalendarEventGetDto>>> GetTodaysTodosByUserId(int userId);
    Task<Response<CalendarEventGetDto>> CreateCalendarEventAsync(CalendarEventCreateDto dto);
    Task<Response<CalendarEventGetDto>> UpdateCalendarEventAsync(int id, CalendarEventUpdateDto dto);
    Task<Response> UpdateTaskStatus(ChangeCalendarEventStatusDto dto);
    Task<Response> DeleteCalendarEventAsync(int id);
}

public class CalendarEventService : ICalendarEventService
{

    private readonly DataContext _dataContext;
    private readonly IMapper _mapper;

    public CalendarEventService(DataContext dataContext, IMapper mapper)
    {
        _dataContext = dataContext;
        _mapper = mapper;
    }

    public async Task<Response<List<CalendarEventGetDto>>> GetCalendarEventsAsync(int calendarId)
    {
        var data = await _dataContext.Set<CalendarEvent>()
            .Where(x => x.CalendarId == calendarId)
            .ProjectTo<CalendarEventGetDto>()
            .ToListAsync();

        return data.AsResponse();
    }

    public async Task<Response<List<CalendarEventGetDto>>> GetCalendarEventsFromCalendars(IEnumerable<int> calendarsIds)
    {
        var data = await _dataContext
            .Set<CalendarEvent>()
            .Where(x => calendarsIds.Contains(x.CalendarId))
            .ProjectTo<CalendarEventGetDto>()
            .ToListAsync();

        return data.AsResponse();
    }

    public async Task<Response<CalendarEventGetDto>> GetCalendarEventByIdAsync(int id)
    {
        var calendarEvent = await _dataContext.Set<CalendarEvent>().FindAsync(id);
        if (calendarEvent is null)
            return Error.AsResponse<CalendarEventGetDto>(ErrorMessages.NotFoundError);
        return MappingExtensions.MapTo<CalendarEventGetDto>(calendarEvent).AsResponse();
    }

    public async Task<Response<List<CalendarEventGetDto>>> GetUpcomingEventsByUserId(int userId)
    {
        var data = await _dataContext
            .Set<CalendarEvent>()
            .Include(x => x.Calendar)
            .Where(x => x.Calendar.CreatedByUserId == userId)
            .Take(3)
            .OrderByDescending(x => x.StartsOn)
            .ProjectTo<CalendarEventGetDto>()
            .ToListAsync();

        return data.AsResponse();
    }

    public async Task<Response<List<CalendarEventGetDto>>> GetTodaysTodosByUserId(int userId)
    {
        var data = await _dataContext
            .Set<CalendarEvent>()
            .Include(x => x.Calendar)
            .ThenInclude(x => x.FamilyCalendars)
            .ThenInclude(x => x.Family)
            .ThenInclude(x => x.FamilyMembers)
            .Where(x => (x.StartsOn == null || x.StartsOn.Value == DateTime.Today) &&
                        x.Calendar.CreatedByUserId == userId || 
                        x.Calendar.FamilyCalendars.Any(fc => fc.Family.FamilyMembers
                            .Any(fm => fm.UserId == userId)))

            .ProjectTo<CalendarEventGetDto>()
            .ToListAsync();

        return data.AsResponse();
    }

    public async Task<Response<CalendarEventGetDto>> CreateCalendarEventAsync(CalendarEventCreateDto dto)
    {
        var calendarEvent = MappingExtensions.MapTo<CalendarEvent>(dto);

        if (dto.CalendarEventType == CalendarEventType.Task)
        {
            calendarEvent.IsAllDay = true;
        }
        
        _dataContext.Set<CalendarEvent>().Add(calendarEvent);
        await _dataContext.SaveChangesAsync();

        return MappingExtensions.MapTo<CalendarEventGetDto>(calendarEvent).AsResponse();
    }

    public async Task<Response<CalendarEventGetDto>> UpdateCalendarEventAsync(int id, CalendarEventUpdateDto dto)
    {
        var calendarEvent = await _dataContext.Set<CalendarEvent>().FirstOrDefaultAsync(x => x.Id == id);
        if (calendarEvent is null)
            return Error.AsResponse<CalendarEventGetDto>(ErrorMessages.NotFoundError);

        _mapper.Map(dto, calendarEvent);

        if (dto.CalendarEventType == CalendarEventType.Task)
        {
            calendarEvent.IsAllDay = true;
        }
        
        await _dataContext.SaveChangesAsync();

        return MappingExtensions.MapTo<CalendarEventGetDto>(calendarEvent).AsResponse();
    }

    public async Task<Response> UpdateTaskStatus(ChangeCalendarEventStatusDto dto)
    {
        var calendarEvent = await _dataContext.Set<CalendarEvent>().FirstOrDefaultAsync(x => x.Id == dto.Id);
        if (calendarEvent is null)
            return Error.AsResponse<CalendarEventGetDto>(ErrorMessages.NotFoundError);

        calendarEvent.IsCompleted = dto.IsCompleted;

        await _dataContext.SaveChangesAsync();
        
        return Response.Success();
    }

    public async Task<Response> DeleteCalendarEventAsync(int id)
    {
        var calendarEvent = await _dataContext.Set<CalendarEvent>().FirstOrDefaultAsync(x => x.Id == id);
        if (calendarEvent is null)
            return Error.AsResponse<CalendarEventGetDto>(ErrorMessages.NotFoundError);

        _dataContext.Set<CalendarEvent>().Remove(calendarEvent);
        await _dataContext.SaveChangesAsync();

        return Response.Success();
    }
}