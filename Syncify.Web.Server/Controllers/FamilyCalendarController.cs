using Microsoft.AspNetCore.Mvc;
using Syncify.Web.Server.Extensions;
using Syncify.Web.Server.Features.FamilyCalendars;

namespace Syncify.Web.Server.Controllers;

[ApiController]
[Route("api/family-calendars")]
public class FamilyCalendarController : ControllerBase
{
    private readonly IFamilyCalendarService _familyCalendarService;

    public FamilyCalendarController(IFamilyCalendarService familyCalendarService)
    {
        _familyCalendarService = familyCalendarService;
    }

    [HttpPost]
    public async Task<ActionResult<Response<FamilyCalendarGetDto>>> AddCalendarToFamily(
        [FromBody] FamilyCalendarCreateDto dto)
    {
        var data = await _familyCalendarService.AddCalendarToFamily(dto with
        {
            CreatedByUserId = HttpContext.User.GetCurrentUserId() ?? 0
        });
        return Ok(data);
    }

    [HttpGet("family/{familyId}")]
    public async Task<ActionResult<Response<List<FamilyCalendarGetDto>>>> GetFamilyCalendars(int familyId)
    {
        var data = await _familyCalendarService.GetFamilyCalendarsByFamilyId(familyId);
        return Ok(data);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Response<FamilyCalendarGetDto>>> GetFamilyCalendarById(int id)
    {
        var data = await _familyCalendarService.GetFamilyCalendarById(id);
        return Ok(data);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<Response>> RemoveCalendarFromFamily(int id)
    {
        var data = await _familyCalendarService.RemoveCalendarFromFamily(id);
        return Ok(data);
    }
}