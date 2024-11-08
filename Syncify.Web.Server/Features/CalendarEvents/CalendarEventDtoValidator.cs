using FluentValidation;

namespace Syncify.Web.Server.Features.CalendarEvents;

using Config = CalendarEventEntityConfiguration;

public class CalendarEventDtoValidator : AbstractValidator<CalendarEventDto>
{
    public CalendarEventDtoValidator()
    {
        RuleFor(x => x.Description).MaximumLength(Config.DescriptionMaxLength);
        RuleFor(x => x.Title).MaximumLength(Config.TitleMaxLength);
        
        RuleFor(x => x.EndsOn)
            .GreaterThan(x => x.StartsOn)
            .When(x => x is { StartsOn: not null, EndsOn: not null })
            .WithMessage("{PropertyName} must be after Starts On");
    }
}

public class CalendarEventCreateDtoValidator : AbstractValidator<CalendarEventCreateDto>
{
    public CalendarEventCreateDtoValidator()
    {
        Include(new CalendarEventDtoValidator());
    }
}

public class CalendarEventUpdateDtoValidator : AbstractValidator<CalendarEventUpdateDto>
{
    public CalendarEventUpdateDtoValidator()
    {
        Include(new CalendarEventDtoValidator());
    }
}