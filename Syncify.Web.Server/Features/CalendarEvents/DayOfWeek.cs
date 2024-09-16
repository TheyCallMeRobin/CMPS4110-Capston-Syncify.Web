using System.Text.Json.Serialization;

namespace Syncify.Web.Server.Features.CalendarEvents;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum DayOfWeek
{
    Sunday,
    Monday,
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
    Satuday
}