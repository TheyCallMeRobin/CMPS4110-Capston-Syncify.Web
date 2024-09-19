using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Syncify.Common.Constants;
using Syncify.Web.Server.Data;
using Syncify.Web.Server.Extensions;

namespace Syncify.Web.Server.Features.CalendarEvents;

public interface ICalendarEventService
{
    Task<Response<List<CalendarEventGetDto>>> GetCalendarEventsAsync(int calendarId);
    Task<Response<CalendarEventGetDto>> GetCalendarEventByIdAsync(int id);
    Task<Response<CalendarEventGetDto>> CreateCalendarEventAsync(CalendarEventCreateDto dto);
    Task<Response<CalendarEventGetDto>> UpdateCalendarEventAsync(int id, CalendarEventUpdateDto dto);
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

    public async Task<Response<CalendarEventGetDto>> GetCalendarEventByIdAsync(int id)
    {
        var calendarEvent = await _dataContext.Set<CalendarEvent>().FindAsync(id);
        if (calendarEvent is null)
            return Error.AsResponse<CalendarEventGetDto>(ErrorMessages.NotFoundError);

        return MappingExtensions.MapTo<CalendarEventGetDto>(calendarEvent).AsResponse();
    }

    public async Task<Response<CalendarEventGetDto>> CreateCalendarEventAsync(CalendarEventCreateDto dto)
    {
        var calendarEvent = MappingExtensions.MapTo<CalendarEvent>(dto);

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
        await _dataContext.SaveChangesAsync();

        return MappingExtensions.MapTo<CalendarEventGetDto>(calendarEvent).AsResponse();
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