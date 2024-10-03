using AutoMapper;
using FluentValidation;

namespace Syncify.Web.Server.Features.CalendarGroups;

public record CalendarGroupDto
{
    public int CalendarId { get; set; }
    public int GroupId { get; set; }
}

public record CalendarGroupGetDto(string CalendarName) : CalendarGroupDto;
public record CalendarGroupCreateDto : CalendarGroupDto;

public class CalendarGroupMappingProfile : Profile
{
    public CalendarGroupMappingProfile()
    {
        CreateMap<CalendarGroup, CalendarGroupGetDto>();
        CreateMap<CalendarGroupCreateDto, CalendarGroup>();
    }
}

public class CalendarGroupDtoValidator : AbstractValidator<CalendarGroupDto>
{
    public CalendarGroupDtoValidator()
    {
        RuleFor(x => x.CalendarId).GreaterThan(0);
        RuleFor(x => x.GroupId).GreaterThan(0);
    }
}

public class CalendarGroupCreateDtoValidator : AbstractValidator<CalendarGroupDto>
{
    public CalendarGroupCreateDtoValidator()
    {
        Include(new CalendarGroupDtoValidator());
    }
}