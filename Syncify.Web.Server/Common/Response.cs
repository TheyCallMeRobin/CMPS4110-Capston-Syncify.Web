namespace Syncify.Web.Server.Common;

public record Response<T>(T? Data)
{
    public IEnumerable<Error> Errors { get; init; } = [];
    public bool HasErrors => Errors.Any();
}
public record Error(string PropertyName, string Message);