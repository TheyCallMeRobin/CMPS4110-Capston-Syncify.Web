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
        RuleFor(x => x.RecurrenceWeekDays).Must(x => x?.Count <= 10);
    }
}