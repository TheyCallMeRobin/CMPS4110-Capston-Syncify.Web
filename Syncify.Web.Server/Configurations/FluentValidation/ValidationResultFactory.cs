using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using SharpGrip.FluentValidation.AutoValidation.Mvc.Results;

namespace Syncify.Web.Server.Configurations.FluentValidation;

public class ValidationResultFactory : IFluentValidationAutoValidationResultFactory
{
    public IActionResult CreateActionResult(ActionExecutingContext context,
        ValidationProblemDetails? validationProblemDetails)
    {
        var errors = CreateErrors(validationProblemDetails).ToList();
        var response = new Response { Errors = errors };

        return new BadRequestObjectResult(response);
    }

    private IEnumerable<Error> CreateErrors(ValidationProblemDetails? validationProblemDetails)
    {
        if (validationProblemDetails is null)
            return [];

        var errors = validationProblemDetails.Errors
            .SelectMany(pair => pair.Value.Select(message => new Error
            {
                PropertyName = pair.Key.ToLower(),
                ErrorMessage = message
            }));

        return errors;
    }
}