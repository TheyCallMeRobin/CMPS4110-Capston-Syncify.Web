using AutoMapper;
using FluentValidation;
using System.Text.Json.Serialization;
using Syncify.Web.Server.Features.CalendarEvents;
using Syncify.Web.Server.Helpers;

namespace Syncify.Web.Server.Features.Calendars;

public record CalendarDto
{
    public string Name { get; set; } = string.Empty;
    public string? DisplayColor { get; set; } = ColorHelpers.GenerateRandomColor();
}

public record CalendarGetDto(int Id, int CreatedByUserId) : CalendarDto;
public record CalendarCreateDto([property: JsonIgnore] int CreatedByUserId) : CalendarDto;
public record CalendarUpdateDto : CalendarDto;

public record CalendarWithEventsDto(int Id, int CreatedByUserId, List<CalendarEventGetDto> CalendarEvents) : CalendarDto;
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
        RuleFor(x => x.Name)
            .MaximumLength(CalendarEntityConfiruation.NameMaxLength)
            .NotEmpty();

        RuleFor(x => x.DisplayColor)
            .MaximumLength(CalendarEntityConfiruation.DisplayColorMaxLength);
    }
}