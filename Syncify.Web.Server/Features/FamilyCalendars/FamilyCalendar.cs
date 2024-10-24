using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Syncify.Web.Server.Features.Authorization;
using Syncify.Web.Server.Features.Calendars;
using Syncify.Web.Server.Features.Families;

namespace Syncify.Web.Server.Features.FamilyCalendars;

public class FamilyCalendar
{
    public int Id { get; set; }
    public int CalendarId { get; set; }
    public int FamilyId { get; set; }
    public int CreatedByUserId { get; set; }

    public Calendar Calendar { get; set; } = default!;
    public Family Family { get; set; } = default!;
    public User CreatedByUser { get; set; } = default!;

}

public class FamilyCalendarEntityConfiguration : IEntityTypeConfiguration<FamilyCalendar>
{
    public void Configure(EntityTypeBuilder<FamilyCalendar> builder)
    {
        builder.ToTable("FamilyCalendars");
        
        builder
            .HasOne(x => x.Family)
            .WithMany()
            .HasForeignKey(x => x.FamilyId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasOne(x => x.Calendar)
            .WithMany(x => x.FamilyCalendars)
            .HasForeignKey(x => x.CalendarId)
            .OnDelete(DeleteBehavior.Restrict);
        
        builder
            .HasOne(x => x.CreatedByUser)
            .WithMany()
            .HasForeignKey(x => x.CreatedByUserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(x => x.CalendarId).IsUnique();
    }
}