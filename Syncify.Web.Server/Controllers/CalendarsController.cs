using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Syncify.Web.Server.Extensions;
using Syncify.Web.Server.Features.Calendars;

namespace Syncify.Web.Server.Controllers;

[ApiController]
[Route("api/calendars")]
[Authorize]
public class CalendarsController : ControllerBase
{
    
    private readonly ICalendarService _calendarService;

    public CalendarsController(ICalendarService calendarService)
    {
        _calendarService = calendarService;
    }

    [HttpPost]
    public async Task<ActionResult<Response<CalendarGetDto>>> Create([FromBody] CalendarCreateDto dto)
    {
        var result = await _calendarService.CreateCalendar(dto with
        {
            CreatedByUserId = HttpContext.User.GetCurrentUserId()
        });
        return Ok(result);
    }

    [HttpGet]
    public async Task<ActionResult<Response<List<CalendarGetDto>>>> GetAll()
    {
        var results = await _calendarService.GetAllCalendars();
        return Ok(results);
    }
    
    [HttpGet("{id}")]
    public async Task<ActionResult<Response<CalendarGetDto>>> GetById(int id)
    {
        var results = await _calendarService.GetCalendarById(id);
        return Ok(results);
    }

    [HttpGet("events/user/{userId}")]
    public async Task<ActionResult<Response<List<CalendarWithEventsDto>>>> GetCalendarsWithEventsByUserId(int userId)
    {
        var data = await _calendarService.GetCalendarsByUserId(userId);
        return Ok(data);
    }
    
    [HttpGet("user/{userId}")]
    public async Task<ActionResult<Response<List<CalendarGetDto>>>> GetByUserId(int userId)
    {
        var results = await _calendarService.GetByUserId(userId);
        return Ok(results);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Response<CalendarGetDto>>> Update([FromRoute] int id, 
        [FromBody] CalendarUpdateDto dto)
    {
        var results = await _calendarService.UpdateCalendar(id, dto);
        return Ok(results);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<Response>> Delete([FromRoute] int id)
    {
        var result = await _calendarService.DeleteCalendar(id);
        return Ok(result);
    }
}