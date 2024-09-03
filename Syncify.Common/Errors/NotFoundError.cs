using Syncify.Common.Constants;

namespace Syncify.Common.Errors;

public class NotFoundError : Error
{
    public NotFoundError() : base(ErrorMessages.NotFoundError)
    {
    }
}