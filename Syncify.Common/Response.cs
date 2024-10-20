using Syncify.Common.Errors;

namespace Syncify.Common;

public record Response<TResult> : Response
{
    public TResult? Data { get; set; }
}

public record Response
{
    public bool HasErrors => Errors.Count != 0;

    public List<Error> Errors { get; set; } = [];

    public void AddErrors(params Error[] errors)
        => Errors.AddRange(errors);
    
    public static Response Success() => new Response();
}