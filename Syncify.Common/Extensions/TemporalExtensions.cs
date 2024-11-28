namespace Syncify.Common.Extensions;

public static class DateTimeOffsetExtensions
{
    public static TimeOnly ToTimeOnly(this DateTimeOffset dt)
    {
        return TimeOnly.FromTimeSpan(dt.TimeOfDay).AddMinutes(dt.TotalOffsetMinutes);
    }
}