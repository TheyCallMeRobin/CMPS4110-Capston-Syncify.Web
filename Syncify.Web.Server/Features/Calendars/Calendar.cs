using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Syncify.Web.Server.Features.Authorization;
using Syncify.Web.Server.Features.CalendarEvents;
using Syncify.Web.Server.Features.FamilyCalendars;
using Syncify.Web.Server.Helpers;

namespace Syncify.Web.Server.Features.Calendars;

public class Calendar
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string DisplayColor { get; set; } = ColorHelpers.GenerateRandomColor();
    public int CreatedByUserId { get; set; }
    public User CreatedByUser { get; set; } = default!;
    public ICollection<CalendarEvent> CalendarEvents { get; set; } = new List<CalendarEvent>();
    public List<FamilyCalendar> FamilyCalendars { get; set; } = [];

}

public class CalendarEntityConfiruation : IEntityTypeConfiguration<Calendar>
{
    internal const short NameMaxLength = 128;
    internal const int DisplayColorMaxLength = 30;

    public void Configure(EntityTypeBuilder<Calendar> builder)
    {
        builder.ToTable("Calendars");

        builder
            .Property(x => x.Name)
            .HasMaxLength(NameMaxLength);

        builder
            .Property(x => x.DisplayColor)
            .HasMaxLength(DisplayColorMaxLength);
        
        builder
            .HasOne(x => x.CreatedByUser).WithMany();
    }
}