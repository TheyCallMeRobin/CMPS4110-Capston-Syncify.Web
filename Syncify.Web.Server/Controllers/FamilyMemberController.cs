using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Syncify.Web.Server.Extensions;
using Syncify.Web.Server.Features.FamilyMembers;

namespace Syncify.Web.Server.Controllers;

[ApiController]
[Authorize]
[Route("api/family-members")]
public class FamilyMemberController : ControllerBase
{
    private readonly IFamilyMemberService _familyMemberService;

    public FamilyMemberController(IFamilyMemberService familyMemberService)
    {
        _familyMemberService = familyMemberService;
    }

    [HttpGet("family/{familyId}")]
    public async Task<ActionResult<Response<List<FamilyMemberGetDto>>>> GetFamilyMembers([FromRoute] int familyId)
    {
        var data = await _familyMemberService.GetFamilyMembers(familyId);
        return Ok(data);
    }

    [HttpDelete("{familyMemberId}")]
    public async Task<ActionResult<Response>> RemoveFamilyMember([FromRoute] int familyMemberId)
    {
        var data = await _familyMemberService.RemoveFamilyMember(familyMemberId, User.GetCurrentUserId());
        return Ok(data);
    }
}