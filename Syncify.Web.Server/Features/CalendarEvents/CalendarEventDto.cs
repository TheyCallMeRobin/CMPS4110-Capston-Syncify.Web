using System.Text.Json.Serialization;
using AutoMapper;
using Syncify.Web.Server.Features.Calendars;

namespace Syncify.Web.Server.Features.CalendarEvents;

public record CalendarEventDto
{
    public string Title { get; set; } = string.Empty;
    public string? DisplayColor { get; set; }
    public string? Description { get; set; }
    public DateOnly StartDate { get; set; }
    public TimeOnly? StartTime { get; set; }
    public TimeOnly? EndTime { get; set; }
    public CalendarEventType CalendarEventType { get; set; } = CalendarEventType.Event;
    public RecurrenceType? RecurrenceType { get; set; }
}

public record CalendarEventGetDto : CalendarEventDto
{
    public int Id { get; set; }
    public int CalendarId { get; set; }
    public List<DayOfWeek>? RecurrenceWeekDays { get; set; } = [];
}

public record CalendarEventUpdateDto : CalendarEventDto
{
    public List<DayOfWeek>? RecurrenceWeekDays { get; set; } = [];
}

public record CalendarEventCreateDto : CalendarEventDto
{
    public int CalendarId { get; set; }
    
    [JsonIgnore]
    public int CreatedByUserId { get; set; }
    
    public List<DayOfWeek>? RecurrenceWeekDays { get; set; } = [];

}

public class CalendarEventMappingProfile : Profile
{
    public CalendarEventMappingProfile()
    {
        CreateMap<CalendarEvent, CalendarEventDto>();
        CreateMap<CalendarEventUpdateDto, CalendarEvent>();
        CreateMap<CalendarEventCreateDto, CalendarEvent>();
        CreateMap<CalendarEvent, CalendarEventGetDto>();
        
    }
}
