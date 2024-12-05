namespace Syncify.Web.Server.Exceptions;

public class NotAuthorizedException : Exception
{
    public NotAuthorizedException(string? message = ErrorMessages.NotAuthorizedError) : 
        base(message)
    {
    }
}