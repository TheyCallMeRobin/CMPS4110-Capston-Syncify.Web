namespace Syncify.Common.Extensions;

public static class ObjectExtensions
{
    public static Response<TResult> AsResponse<TResult>(this TResult item)
    {
        return new Response<TResult> { Data = item };
    }
}