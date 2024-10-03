using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Syncify.Web.Server.Extensions;
using Syncify.Web.Server.Features.Groups;

namespace Syncify.Web.Server.Controllers;

using GetResponse = Response<GroupGetDto>;

[ApiController]
[Route("api/groups")]
public class GroupsController : Controller
{

    private readonly IGroupService _groupService;

    public GroupsController(IGroupService groupService)
    {
        _groupService = groupService;
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<GetResponse>> CreateGroup([FromBody] GroupCreateDto dto)
    {
        var data = await _groupService.CreateGroup(dto with
        {
            CreatedByUserId = HttpContext.User.GetCurrentUserId() ?? 0
        });

        return Ok(data);
    }

    [HttpGet]
    public async Task<ActionResult<Response<GroupGetDto>>> GetAllGroups()
    {
        var data = await _groupService.GetAllGroups();
        return Ok(data);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<GetResponse>> GetGroupById(int id)
    {
        var data = await _groupService.GetGroupById(id);
        return Ok(data);
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<ActionResult<GetResponse>> UpdateGroup(int id, GroupUpdateDto dto)
    {
        var data = await _groupService.UpdateGroup(id, dto);
        return Ok(data);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<Response>> DeleteGroup(int id)
    {
        var data = await _groupService.DeleteGroup(id);
        return Ok(data);
    }
}