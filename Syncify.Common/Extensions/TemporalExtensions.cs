namespace Syncify.Common.Extensions;

public static class DateTimeOffsetExtensions
{
    
    
    public static TimeOnly ToTimeOnly(this DateTimeOffset dt)
    {
        return TimeOnly.FromTimeSpan(dt.TimeOfDay);
    }

    public static DateOnly ToDateOnly(this DateTimeOffset dt)
    {
        return DateOnly.FromDateTime(dt.Date);
    }

}
