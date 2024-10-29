
using AutoMapper;
using System.Text.Json.Serialization;
using Syncify.Web.Server.Extensions;

namespace Syncify.Web.Server.Features.CalendarEvents;

public record CalendarEventDto
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsCompleted { get; set; }
    public DateTimeOffset? StartsOn { get; set; } = DateTimeOffset.Now;
    public DateTimeOffset? EndsOn { get; set; }

    public CalendarEventType CalendarEventType { get; set; } = CalendarEventType.Event;
    public EventRecurrenceType? RecurrenceType { get; set; } = EventRecurrenceType.None;
}

public record CalendarEventGetDto : CalendarEventDto
{
    public int Id { get; set; }
    public int CalendarId { get; set; }
    public List<DayOfWeek>? RecurrenceWeekDays { get; set; } = [];

    public bool IsAllDay => (StartsOn.HasValue && !EndsOn.HasValue) ||
                            (StartsOn.HasValue && EndsOn == DateTimeOffset.Now.EndOfDay());
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

public record ChangeCalendarEventStatusDto([property: JsonIgnore] int Id, bool IsCompleted);

public class CalendarEventMappingProfile : Profile
{
    public CalendarEventMappingProfile()
    {
        CreateMap<CalendarEvent, CalendarEventDto>();
        CreateMap<CalendarEventUpdateDto, CalendarEvent>();
        CreateMap<CalendarEventCreateDto, CalendarEvent>()
            .ForMember(x => x.EndsOn, opts => opts.MapFrom(x => MapEndsOn(x)));
        CreateMap<CalendarEvent, CalendarEventGetDto>();
    }
    
    private static DateTimeOffset? MapEndsOn(CalendarEventCreateDto dto)
    {
        if (!dto.EndsOn.HasValue)
        {
            return dto.StartsOn?.EndOfDay() ?? DateTimeOffset.Now.EndOfDay();
        }

        return dto.EndsOn;
    }
}