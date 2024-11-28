using AutoMapper;
using System.Text.Json.Serialization;

namespace Syncify.Web.Server.Features.CalendarEvents;

public record CalendarEventDto
{
    public string Title { get; set; } = string.Empty;
    public int CalendarId { get; set; }
    public string? Description { get; set; }
    public string? RecurrenceRule { get; set; }
    public int? RecurrenceId { get; set; }
    public string? RecurrenceException { get; set; }
    public bool IsCompleted { get; set; }


    public CalendarEventType CalendarEventType { get; set; } = CalendarEventType.Event;
}

public record CalendarEventGetDto : CalendarEventDto
{
    public int Id { get; set; }
    public string? CalendarDisplayColor { get; set; }

    public DateTimeOffset? StartsOn { get; set; } = DateTimeOffset.Now;
    public DateTimeOffset? EndsOn { get; set; }
    
    public bool IsAllDay { get; set; }
}

public record CalendarEventWriteDto : CalendarEventDto
{
    public TimeOnly StartsOnTime { get; set; } = TimeOnly.FromDateTime(DateTime.Now);
    public TimeOnly? EndsOnTime { get; set; }
    
    /// <remarks>
    /// This is <see cref="DateTimeOffset"/> rather than <see cref="DateOnly" />
    /// the TimeZone Offset needs to be captured as well
    /// </remarks>
    public DateTimeOffset StartsOnDate { get; set; }
    
    /// <remarks>
    /// This is <see cref="DateTimeOffset"/> rather than <see cref="DateOnly" />
    /// the TimeZone Offset needs to be captured as well
    /// </remarks>
    public DateTimeOffset? EndsOnDate { get; set; }
}

public record CalendarEventUpdateDto : CalendarEventWriteDto
{
    
    [JsonIgnore]
    public int? UpdatedByUserId { get; set; }
};

public record CalendarEventCreateDto : CalendarEventWriteDto
{
    
    [JsonIgnore]
    public int CreatedByUserId { get; set; }
}

public record ChangeCalendarEventStatusDto([property: JsonIgnore] int Id, bool IsCompleted);

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