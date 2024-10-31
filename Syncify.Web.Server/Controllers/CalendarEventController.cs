using Microsoft.AspNetCore.Mvc;
using Syncify.Web.Server.Extensions;
using Syncify.Web.Server.Features.CalendarEvents;

namespace Syncify.Web.Server.Controllers;

[ApiController]
[Route("api/calendar-events")]
public class CalendarEventController : ControllerBase
{
    private readonly ICalendarEventService _calendarEventService;

    public CalendarEventController(ICalendarEventService calendarEventService)
    {
        _calendarEventService = calendarEventService;
    }

    [HttpPost]
    public async Task<ActionResult<Response<CalendarEventGetDto>>> CreateCalendarEvent(
        [FromBody] CalendarEventCreateDto dto)
    {
        var data = await _calendarEventService.CreateCalendarEventAsync(dto with
        {
            CreatedByUserId = HttpContext.User.GetCurrentUserId()
        });
        return Ok(data);
    }

    [HttpGet("calendar/{calendarId}")]
    public async Task<ActionResult<Response<List<CalendarEventGetDto>>>> GetCalendarEvents(int calendarId)
    {
        var data = await _calendarEventService.GetCalendarEventsAsync(calendarId);
        return Ok(data);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Response<CalendarEventGetDto>>> GetCalendarEventById(int id)
    {
        var data = await _calendarEventService.GetCalendarEventByIdAsync(id);
        return Ok(data);
    }

    [HttpGet("upcoming-events/{userId}")]
    public async Task<ActionResult<Response<List<CalendarEventGetDto>>>> GetUpcomingEventsByUserId(int userId)
    {
        var data = await _calendarEventService.GetUpcomingEventsByUserId(userId);
        return Ok(data);
    }

    [HttpGet("todays-todos/{userId}")]
    public async Task<ActionResult<Response<List<CalendarEventGetDto>>>> GetTodaysTodosByUserId(int userId)
    {
        var data = await _calendarEventService.GetTodaysTodosByUserId(userId);
        return Ok(data);
    }

    [HttpGet("calendars")]
    public async Task<ActionResult<Response<List<CalendarEventGetDto>>>> GetCalendarEventsFromCalendars(
        [FromQuery] List<int> calendarsIds)
    {
        var data = await _calendarEventService.GetCalendarEventsFromCalendars(calendarsIds);
        return Ok(data);
    }
    
    [HttpPut("{id}")]
    public async Task<ActionResult<Response<CalendarEventGetDto>>> UpdateCalendarEvent(
        [FromRoute] int id, [FromBody] CalendarEventUpdateDto dto)
    {
        var data = await _calendarEventService.UpdateCalendarEventAsync(id, dto);
        return Ok(data);
    }

    [HttpPut("status/{id}")]
    public async Task<ActionResult<Response>> UpdateTaskStatus(int id, ChangeCalendarEventStatusDto dto)
    {
        var data = await _calendarEventService.UpdateTaskStatus(dto with { Id = id });
        return Ok(data);
    }
    
    [HttpDelete("{id}")]
    public async Task<ActionResult<Response>> DeleteCalendarEvent(int id)
    {
        var data = await _calendarEventService.DeleteCalendarEventAsync(id);
        return Ok(data);
    }
}