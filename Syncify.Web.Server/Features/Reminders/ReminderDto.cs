using Syncify.Web.Server.Features.Reminders;

namespace Syncify.Web.Server.Features.Reminders
{
    public class ReminderCreateDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime ReminderDateTime { get; set; }
        public int UserId { get; set; }
    }

    public class ReminderGetDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime ReminderDateTime { get; set; }
        public int UserId { get; set; }
    }

    public class ReminderUpdateDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime ReminderDateTime { get; set; }
    }
}