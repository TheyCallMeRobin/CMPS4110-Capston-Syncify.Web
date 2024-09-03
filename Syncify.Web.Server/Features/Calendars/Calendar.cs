using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Syncify.Web.Server.Features.Users;

namespace Syncify.Web.Server.Features.Calendars;

public class Calendar
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    
    public int CreatedByUserId { get; set; }
    public User CreatedByUser { get; set; } = default!;
}

public class CalendarEntityConfiruation : IEntityTypeConfiguration<Calendar>
{
    public void Configure(EntityTypeBuilder<Calendar> builder)
    {
        builder.ToTable("Calendars");
        builder.HasOne(x => x.CreatedByUser).WithMany();
    }
}