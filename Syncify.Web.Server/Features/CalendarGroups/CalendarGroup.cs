using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Syncify.Web.Server.Features.Calendars;
using Syncify.Web.Server.Features.Groups;

namespace Syncify.Web.Server.Features.CalendarGroups;

public class CalendarGroup
{
    public int Id { get; set; }
    public int CalendarId { get; set; }
    public int GroupId { get; set; }

    public Calendar Calendar { get; set; } = default!;
    public Group Group { get; set; } = default!;
}

public class CalendarGroupEntityConfiguration : IEntityTypeConfiguration<CalendarGroup>
{
    public void Configure(EntityTypeBuilder<CalendarGroup> builder)
    {
        builder.ToTable("CalendarGroups");

        builder.HasIndex(x => new { x.CalendarId, x.GroupId }).IsUnique();

        builder.HasOne(x => x.Group).WithMany();
        builder.HasOne(x => x.Calendar).WithMany();
    }
}