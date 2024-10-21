using Serilog;
using System.Net;
using System.Text.Json;
using Syncify.Common.Constants;

namespace Syncify.Web.Server.Middlewares;

public class ErrorHandlingMiddleware
{

    private readonly RequestDelegate _next;

    public ErrorHandlingMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var response = context.Response;
        
        try
        {
            await _next(context);
        }
        catch (Exception exception)
        {
            Log.Error(exception, ErrorMessages.UnknownError);

            response.ContentType = ResponseTypes.ApplicationJson;
            response.StatusCode = (int) HttpStatusCode.InternalServerError;

            var error = new Error { ErrorMessage = ErrorMessages.UnknownError };
            await response.WriteAsync(JsonSerializer.Serialize(error));
        }
    }
}