using System.Text.Json.Serialization;

namespace Syncify.Web.Server.Features.FamilyInvites;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum InviteStatus
{
    Pending,
    Accepted,
    Declined,
    Expired
}