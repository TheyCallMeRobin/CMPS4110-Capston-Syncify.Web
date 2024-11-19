using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Syncify.Web.Server.Features.Authorization;
namespace Syncify.Web.Server.Features.Reminders
{
    public class Reminder
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime ReminderDateTime { get; set; }
        public int UserId { get; set; }
    }
}
