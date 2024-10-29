namespace Syncify.Web.Server.Extensions;

public static class DateTimeOffsetExtensions
{
    public static DateTimeOffset EndOfDay(this DateTimeOffset dateTime)
    {
        return new DateTimeOffset(dateTime.Year, dateTime.Month, dateTime.Day, 23, 59, 59, 999, dateTime.Offset);
    }
}