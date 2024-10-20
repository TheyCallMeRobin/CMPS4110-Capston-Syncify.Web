using Syncify.Common.Extensions;

namespace Syncify.Common.Errors;

public class Error
{
    public Error()
    {
    }
    public Error(string errorMessage, string? propertyName = "")
    {
        ErrorMessage = errorMessage;
        PropertyName = propertyName;
    }

    public string ErrorMessage { get; set; } = string.Empty;
    public string? PropertyName { get; set; }
    
    public static Response AsResponse(string errorMessage, string propertyName = "")
    {
        return new Error
        {
            PropertyName = propertyName,
            ErrorMessage = errorMessage
        }.AsResponse();
    }

    public static Response<TResult> AsResponse<TResult>(string errorMessage, string propertyName = "")
    {
        return new Error
        {
            PropertyName = propertyName,
            ErrorMessage = errorMessage
        }.AsResponse<TResult>();
    }

}