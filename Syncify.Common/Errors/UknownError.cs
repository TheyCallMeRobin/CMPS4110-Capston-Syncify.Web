using Syncify.Common.Constants;

namespace Syncify.Common.Errors;

public class UknownError : Error
{
    public UknownError() : base(ErrorMessages.UnknownError)
    {

    }
}