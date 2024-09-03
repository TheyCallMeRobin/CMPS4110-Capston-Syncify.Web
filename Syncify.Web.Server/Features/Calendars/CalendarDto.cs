using System.Text.Json.Serialization;
using AutoMapper;
using FluentValidation;
using Syncify.Web.Server.Features.Authorization;

namespace Syncify.Web.Server.Features.Calendars;

public record CalendarGetDto(int Id, string Name, int CreatedByUserId, UserGetDto CreatedByUser);
public record CalendarCreateDto(string Name, int CreatedByUserId);
public record CalendarUpdateDto(string Name);
public class CalendarMappingProfile : Profile
{
    public CalendarMappingProfile()
    {
        CreateMap<Calendar, CalendarGetDto>();
        CreateMap<CalendarCreateDto, Calendar>();
    }
}

public class CalendarCreateDtoValidator : AbstractValidator<CalendarCreateDto>
{
    public CalendarCreateDtoValidator()
    {
        RuleFor(x => x.Name).MaximumLength(128).NotEmpty();
    }
}