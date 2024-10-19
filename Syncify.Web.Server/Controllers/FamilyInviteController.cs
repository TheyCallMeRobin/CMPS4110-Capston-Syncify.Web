using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Syncify.Web.Server.Extensions;
using Syncify.Web.Server.Features.FamilyInvites;

namespace Syncify.Web.Server.Controllers;

[ApiController]
[Authorize]
[Route("api/family-invites")]
public class FamilyInviteController : ControllerBase
{
    private readonly IFamilyInviteService _familyInviteService;

    public FamilyInviteController(IFamilyInviteService familyInviteService)
    {
        _familyInviteService = familyInviteService;
    }

    [HttpGet("user/{userId}")]
    public async Task<ActionResult<Response<FamilyInviteGetDto>>> GetInvitesByUserId([FromRoute] int userId)
    {
        var data = await _familyInviteService.GetInvitesByUserId(userId);
        return Ok(data);
    }
    
    [HttpGet("family/{familyId}")]
    public async Task<ActionResult<Response<FamilyInviteGetDto>>> GetInvitesByFamilyId([FromRoute] int familyId)
    {
        var data = await _familyInviteService.GetInvitesByFamilyId(familyId);
        return Ok(data);
    }

    [HttpPost]
    public async Task<ActionResult<Response<FamilyInviteGetDto>>> CreateInvite([FromBody] FamilyInviteCreateDto dto,
        [FromQuery] CreateFamilyInviteQuery query)
    {
        var data = await _familyInviteService.CreateInviteAsync(dto with
        {
            SentByUserId = HttpContext.User.GetCurrentUserId()
        }, query);
        return Ok(data);
    }

    [HttpPut]
    public async Task<ActionResult<Response<FamilyInviteGetDto>>> ChangeInviteStatus(
        [FromBody] ChangeInviteStatusDto dto)
    {
        var data = await _familyInviteService.ChangeInviteStatusAsync(dto);
        return Ok(data);
    }
}