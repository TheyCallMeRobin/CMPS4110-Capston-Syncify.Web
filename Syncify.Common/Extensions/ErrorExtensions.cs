using Syncify.Common.Errors;

namespace Syncify.Common.Extensions;

public static class ErrorExtensions
{
    public static Response AsResponse(this Error error)
        => new Response
        {
            Errors = [error]
        };

    public static Response<TResult> AsResponse<TResult>(this Error error)
        => new Response<TResult>
        {
            Errors = [error]
        };
}