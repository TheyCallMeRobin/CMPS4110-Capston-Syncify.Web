using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Syncify.Web.Server.Extensions;
using Syncify.Web.Server.Features.Families;

namespace Syncify.Web.Server.Controllers;

using GetResponse = Response<FamilyGetDto>;

[ApiController]
[Route("api/families")]
public class FamiliesController : Controller
{

    private readonly IFamilyService _familyService;

    public FamiliesController(IFamilyService familyService)
    {
        _familyService = familyService;
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<GetResponse>> CreateFamily([FromBody] FamilyCreateDto dto)
    {
        var data = await _familyService.CreateFamily(dto with
        {
            CreatedByUserId = HttpContext.User.GetCurrentUserId() ?? 0
        });

        return Ok(data);
    }

    [HttpGet]
    public async Task<ActionResult<Response<FamilyGetDto>>> GetAllFamilies()
    {
        var data = await _familyService.GetAllFamilies();
        return Ok(data);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<GetResponse>> GetFamilyById(int id)
    {
        var data = await _familyService.GetFamilyById(id);
        return Ok(data);
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<ActionResult<GetResponse>> UpdateFamily(int id, FamilyUpdateDto dto)
    {
        var data = await _familyService.UpdateFamily(id, dto);
        return Ok(data);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<Response>> DeleteFamily(int id)
    {
        var data = await _familyService.DeleteFamily(id);
        return Ok(data);
    }
}