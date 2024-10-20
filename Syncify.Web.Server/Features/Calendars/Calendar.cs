using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Syncify.Web.Server.Features.Authorization;
using Syncify.Web.Server.Features.CalendarEvents;

namespace Syncify.Web.Server.Features.Calendars;

public class Calendar
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;

    public int CreatedByUserId { get; set; }
    public User CreatedByUser { get; set; } = default!;
    public ICollection<CalendarEvent> CalendarEvents { get; set; } = new List<CalendarEvent>();

}

public class CalendarEntityConfiruation : IEntityTypeConfiguration<Calendar>
{
    public const short NameMaxLength = 128;
    public void Configure(EntityTypeBuilder<Calendar> builder)
    {
        builder.ToTable("Calendars");

        builder.Property(x => x.Name).HasMaxLength(NameMaxLength);

        builder.HasOne(x => x.CreatedByUser).WithMany();
    }
}