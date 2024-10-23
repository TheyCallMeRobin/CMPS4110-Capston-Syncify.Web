using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Syncify.Web.Server.Features.Authorization;
using Syncify.Web.Server.Features.Calendars;
using Syncify.Web.Server.Features.FamilyCalendars;

namespace Syncify.Web.Server.Features.CalendarEvents;

public class CalendarEvent
{
    public int Id { get; set; }
    public int CalendarId { get; set; }
    public int CreatedByUserId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; } = string.Empty;
    public string? DisplayColor { get; set; } = string.Empty;
    public bool IsCompleted { get; set; }
    public DateOnly? StartDate { get; set; }
    public TimeOnly? StartTime { get; set; }
    public TimeOnly? EndTime { get; set; }
    public CalendarEventType CalendarEventType { get; set; } = CalendarEventType.Event;
    public RecurrenceType? RecurrenceType { get; set; }
    public DateOnly? RecurrenceEndDate { get; set; }
    public List<DayOfWeek>? RecurrenceWeekDays { get; set; }

    public Calendar Calendar { get; set; } = default!;
    public User CreatedByUser { get; set; } = default!;

}

public class CalendarEventEntityConfiguration : IEntityTypeConfiguration<CalendarEvent>
{
    internal const int ColorMaxLength = 30;
    internal const int TitleMaxLength = 256;
    internal const int DescriptionMaxLength = 2056;
    public void Configure(EntityTypeBuilder<CalendarEvent> builder)
    {
        builder.ToTable("CalendarEvents");

        builder.Property(x => x.CalendarEventType).HasDefaultValue(CalendarEventType.Event);
        
        builder
            .Property(x => x.RecurrenceWeekDays)
            .HasMaxLength(-1)
            .IsUnicode(false);

        builder
            .Property(x => x.Title)
            .HasMaxLength(TitleMaxLength)
            .IsRequired();

        builder
            .Property(x => x.DisplayColor)
            .HasMaxLength(ColorMaxLength)
            .IsRequired(false);
        
        builder
            .Property(x => x.Description)
            .HasMaxLength(DescriptionMaxLength)
            .IsRequired();

        builder
            .Property(x => x.Description)
            .IsRequired(false);

        builder
            .Property(x => x.StartDate)
            .IsRequired(false);
    }
}