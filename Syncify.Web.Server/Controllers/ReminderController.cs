using Microsoft.AspNetCore.Mvc;
using Syncify.Web.Server.Features.Reminders;
using System.Threading.Tasks;

namespace Syncify.Web.Server.Features.Reminders
{
    [ApiController]
    [Route("api/[controller]")]
    public class RemindersController : ControllerBase
    {
        private readonly IReminderService _reminderService;

        public RemindersController(IReminderService reminderService)
        {
            _reminderService = reminderService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateReminder([FromBody] ReminderCreateDto dto)
        {
            var response = await _reminderService.CreateReminder(dto);
            if (response.HasErrors)
            {
                return BadRequest(response.Errors);
            }

            return Ok(response.Data);
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetRemindersByUserId(int userId)
        {
            var reminders = await _reminderService.GetRemindersByUserId(userId);
            return Ok(reminders);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetReminderById(int id)
        {
            var response = await _reminderService.GetById(id);
            if (response.HasErrors)
            {
                return NotFound(response.Errors);
            }

            return Ok(response.Data);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateReminder(int id, [FromBody] ReminderUpdateDto dto)
        {
            var response = await _reminderService.UpdateReminder(id, dto);
            if (response.HasErrors)
            {
                return NotFound(response.Errors);
            }

            return Ok(response.Data);
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReminder(int id)
        {
            var response = await _reminderService.DeleteReminder(id);
            if (response.HasErrors)
            {
                return NotFound(response.Errors);
            }

            return NoContent();
        }
    }
}
