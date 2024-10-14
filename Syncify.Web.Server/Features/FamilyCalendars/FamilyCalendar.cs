using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Syncify.Web.Server.Features.Calendars;
using Syncify.Web.Server.Features.Families;

namespace Syncify.Web.Server.Features.FamilyCalendars;

public class FamilyCalendar
{
    public int Id { get; set; }
    public int CalendarId { get; set; }
    public int GroupId { get; set; }

    public Calendar Calendar { get; set; } = default!;
    public Family Family { get; set; } = default!;
}

public class FamilyCalendarEntityConfiguration : IEntityTypeConfiguration<FamilyCalendar>
{
    public void Configure(EntityTypeBuilder<FamilyCalendar> builder)
    {
        builder.ToTable("GroupCalendars");

        builder.HasIndex(x => new { x.CalendarId, x.GroupId }).IsUnique();

        builder.HasOne(x => x.Family).WithMany();
        builder.HasOne(x => x.Calendar).WithMany();
    }
}