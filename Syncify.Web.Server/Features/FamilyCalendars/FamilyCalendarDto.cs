using AutoMapper;
using FluentValidation;
using Syncify.Web.Server.Features.FamilyCalendars;

namespace Syncify.Web.Server.Features.GroupCalendars;

public record FamilyCalendarDto
{
    public int CalendarId { get; set; }
    public int GroupId { get; set; }
}

public record FamilyCalendarGetDto(string CalendarName) : FamilyCalendarDto;
public record FamilyCalendarCreateDto : FamilyCalendarDto;

public class FamilyCalendarMappingProfile : Profile
{
    public FamilyCalendarMappingProfile()
    {
        CreateMap<FamilyCalendar, FamilyCalendarGetDto>();
        CreateMap<FamilyCalendarCreateDto, FamilyCalendar>();
    }
}

public class FamilyCalendarDtoValidator : AbstractValidator<FamilyCalendarDto>
{
    public FamilyCalendarDtoValidator()
    {
        RuleFor(x => x.CalendarId).GreaterThan(0);
        RuleFor(x => x.GroupId).GreaterThan(0);
    }
}

public class FamilyCalendarCreateDtoValidator : AbstractValidator<FamilyCalendarDto>
{
    public FamilyCalendarCreateDtoValidator()
    {
        Include(new FamilyCalendarDtoValidator());
    }
}