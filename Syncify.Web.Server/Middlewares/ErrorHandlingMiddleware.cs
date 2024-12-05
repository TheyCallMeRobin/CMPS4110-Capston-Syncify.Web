using Serilog;
using System.Net;
using System.Text.Json;
using Syncify.Common.Constants;
using Syncify.Web.Server.Exceptions;

namespace Syncify.Web.Server.Middlewares;

public class ErrorHandlingMiddleware
{

    private readonly RequestDelegate _next;

    private readonly JsonSerializerOptions _options = new()
    {
        WriteIndented = true, 
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };
    
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
        catch (NotAuthorizedException)
        {
            response.ContentType = ResponseTypes.ApplicationJson;
            response.StatusCode = (int) HttpStatusCode.Unauthorized;
            
            var error = new Error { ErrorMessage = ErrorMessages.NotAuthorizedError };
            
            var responseResult = new Response();
            responseResult.AddErrors(error);

            await response.WriteAsync(JsonSerializer.Serialize(responseResult, _options));
        }
        catch (Exception exception)
        {
            Log.Error(exception, ErrorMessages.UnknownError);

            response.ContentType = ResponseTypes.ApplicationJson;
            response.StatusCode = (int) HttpStatusCode.InternalServerError;

            var error = new Error { ErrorMessage = ErrorMessages.UnknownError };
            
            var responseResult = new Response();
            responseResult.AddErrors(error);

            await response.WriteAsync(JsonSerializer.Serialize(responseResult, _options));
        }
    }
}