using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Syncify.Common.DataClasses;
using Syncify.Web.Server.Extensions;
using Syncify.Web.Server.Features.Families;

namespace Syncify.Web.Server.Controllers;

using GetResponse = Response<FamilyGetDto>;

[ApiController]
[Authorize]
[Route("api/families")] 
public class FamilyController : Controller
{
    private readonly IFamilyService _familyService;

    public FamilyController(IFamilyService familyService)
    {
        _familyService = familyService;
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<GetResponse>> CreateFamily([FromBody] FamilyCreateDto dto)
    {
        var data = await _familyService.CreateFamily(dto with
        {
            CreatedByUserId = HttpContext.User.GetCurrentUserId()
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

    [HttpGet("user/{userId}")]
    public async Task<ActionResult<Response<List<FamilyGetDto>>>> GetFamiliesByUserId(int userId)
    {
        var data = await _familyService.GetFamiliesByUserId(userId);
        return Ok(data);
    }

    [HttpGet("options/{userId}")]
    public async Task<ActionResult<Response<List<OptionDto>>>> GetFamilyOptionsForUser(int userId)
    {
        var data = await _familyService.GetFamilyOptionsForUser(userId);
        return Ok(data);
    }
    
    [HttpPut("{id}")]
    public async Task<ActionResult<GetResponse>> UpdateFamily(int id, FamilyUpdateDto dto)
    {
        var data = await _familyService.UpdateFamily(id, dto, User.GetCurrentUserId());
        return Ok(data);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<Response>> DeleteFamily(int id)
    {
        var data = await _familyService.DeleteFamily(id, User.GetCurrentUserId());
        return Ok(data);
    }
}