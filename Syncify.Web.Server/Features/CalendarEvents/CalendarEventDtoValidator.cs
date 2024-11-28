using FluentValidation;

namespace Syncify.Web.Server.Features.CalendarEvents;

using Config = CalendarEventEntityConfiguration;

public class CalendarEventDtoValidator : AbstractValidator<CalendarEventDto>
{
    public CalendarEventDtoValidator()
    {
        RuleFor(x => x.Description).MaximumLength(Config.DescriptionMaxLength);
        RuleFor(x => x.Title).MaximumLength(Config.TitleMaxLength);
    }
}

public class CalendarEventCreateDtoValidator : AbstractValidator<CalendarEventCreateDto>
{
    public CalendarEventCreateDtoValidator()
    {
        Include(new CalendarEventDtoValidator());
        
        RuleFor(x => x.EndsOnTime)
            .GreaterThan(x => x.StartsOnTime)
            .When(ValidatorHelper.StartsOnIsTheSameDay)
            .WithMessage("{PropertyName} must be after Starts On");
        
        RuleFor(x => x.EndsOnDate)
            .GreaterThan(x => x.StartsOnDate)
            .When(x => x.EndsOnDate is not null);
    }
}

public class CalendarEventUpdateDtoValidator : AbstractValidator<CalendarEventUpdateDto>
{
    public CalendarEventUpdateDtoValidator()
    {
        Include(new CalendarEventDtoValidator());
        
        RuleFor(x => x.EndsOnTime)
            .GreaterThan(x => x.StartsOnTime)
            .When(ValidatorHelper.StartsOnIsTheSameDay)
            .WithMessage("{PropertyName} must be after Starts On");

        RuleFor(x => x.EndsOnDate)
            .GreaterThan(x => x.StartsOnDate)
            .When(x => x.EndsOnDate is not null);
    }
}

file static class ValidatorHelper
{
    public static bool StartsOnIsTheSameDay(CalendarEventWriteDto calendarEvent)
    {
        return calendarEvent switch
        {
            { EndsOnTime: null, EndsOnDate: null } => false,
            { EndsOnDate: null } => false,
            {
                StartsOnDate.Date: var startsOnDate, EndsOnDate.Date: var endsOnDate
            } when startsOnDate == endsOnDate => true,
            _ => false
        };
    }
}