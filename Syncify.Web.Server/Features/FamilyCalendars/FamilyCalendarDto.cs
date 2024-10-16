using AutoMapper;
using FluentValidation;

namespace Syncify.Web.Server.Features.FamilyCalendars;

public record FamilyCalendarDto
{
    public int CalendarId { get; set; }
    public int FamilyId { get; set; }
}

public record FamilyCalendarGetDto(string CalendarName) : FamilyCalendarDto;
public record FamilyCalendarCreateDto(int CreatedByUserId) : FamilyCalendarDto;

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
        RuleFor(x => x.FamilyId).GreaterThan(0);
    }
}

public class FamilyCalendarCreateDtoValidator : AbstractValidator<FamilyCalendarDto>
{
    public FamilyCalendarCreateDtoValidator()
    {
        Include(new FamilyCalendarDtoValidator());
    }
}