using System.Text.Json.Serialization;

namespace Syncify.Web.Server.Features.CalendarEvents;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum CalendarEventType
{
    Event,
    Task
}