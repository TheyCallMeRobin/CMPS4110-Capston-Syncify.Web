using Microsoft.AspNetCore.Mvc;
using Syncify.Web.Server.Common;
using System.Linq;

namespace Syncify.Web.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UnitsController : ControllerBase
    {
        [HttpGet("list")]
        public IActionResult GetUnits()
        {
            var units = System.Enum.GetNames(typeof(Units)).ToList();
            return Ok(units);
        }
    }
}
