using AutoMapper;
using FluentValidation;
using System.Text.Json.Serialization;
using Syncify.Web.Server.Features.CalendarEvents;

namespace Syncify.Web.Server.Features.Calendars;

public record CalendarGetDto(int Id, string Name, int CreatedByUserId);
public record CalendarCreateDto(string Name, [property: JsonIgnore] int CreatedByUserId);
public record CalendarUpdateDto(string Name);

public record CalendarWithEventsDto(int Id, string Name, int CreatedByUserId, List<CalendarEventGetDto> CalendarEvents);
public class CalendarMappingProfile : Profile
{
    public CalendarMappingProfile()
    {
        CreateMap<Calendar, CalendarGetDto>();
        CreateMap<Calendar, CalendarWithEventsDto>()
            .ForMember(x => x.CalendarEvents, opts => opts.MapFrom(src => src.CalendarEvents));
        CreateMap<CalendarCreateDto, Calendar>();
    }
}

public class CalendarCreateDtoValidator : AbstractValidator<CalendarCreateDto>
{
    public CalendarCreateDtoValidator()
    {
        RuleFor(x => x.Name).MaximumLength(CalendarEntityConfiruation.NameMaxLength).NotEmpty();
    }
}