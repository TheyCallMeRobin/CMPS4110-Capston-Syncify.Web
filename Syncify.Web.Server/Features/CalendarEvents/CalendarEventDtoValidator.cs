using FluentValidation;

namespace Syncify.Web.Server.Features.CalendarEvents;

using Config = CalendarEventEntityConfiguration;

public class CalendarEventDtoValidator : AbstractValidator<CalendarEventDto>
{
    
    public CalendarEventDtoValidator()
    {
        RuleFor(x => x.Description).MaximumLength(Config.DescriptionMaxLength);
        RuleFor(x => x.Title).MaximumLength(Config.TitleMaxLength);
        RuleFor(x => x.DisplayColor).MaximumLength(Config.ColorMaxLength);
        
        RuleFor(x => x.StartsOn)
            .LessThan(x => x.EndsOn)
            .When(x => x is { StartsOn: not null, EndsOn: not null });
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