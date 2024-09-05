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
            CreatedByUserId = HttpContext.User.GetCurrentUserId() ?? 0
        });
        return Ok(result);
    }
}