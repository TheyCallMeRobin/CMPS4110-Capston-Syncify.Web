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

    public DateTimeOffset StartsOnTime { get; set; } = DateTimeOffset.Now;
    public DateTimeOffset? EndsOnTime { get; set; }
    public DateTimeOffset StartsOnDate { get; set; } = DateTimeOffset.Now;
    
    public DateTimeOffset? EndsOnDate { get; set; }

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

public record CalendarEventUpdateDto : CalendarEventDto
{
    
    [JsonIgnore]
    public int? UpdatedByUserId { get; set; }
};

public record CalendarEventCreateDto : CalendarEventDto
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
        CreateMap<CalendarEvent, CalendarEventGetDto>()
            .ForMember(dest => dest.StartsOnDate, opts => opts.MapFrom(src => src.StartsOn.GetValueOrDefault()))
            .ForMember(dest => dest.EndsOnDate, opts => opts.MapFrom(src => src.EndsOn))
            .ForMember(dest => dest.StartsOnTime, opts => opts.MapFrom(src => src.StartsOn))
            .ForMember(dest => dest.EndsOnTime, opts => opts.MapFrom(src => src.EndsOn));
    }
}
