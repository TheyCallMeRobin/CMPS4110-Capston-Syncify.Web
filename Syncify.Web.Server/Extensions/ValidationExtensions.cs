using FluentValidation;

namespace Syncify.Web.Server.Extensions;

public static class ValidationExtensions
{
    private static readonly char[] SpecialCharacters =
    [
        '!', '@', '#', '$', '%', '^', '&', '*', '(', ')',
        '-', '_', '=', '+', '[', ']', '{', '}', '\\', '|',
        ';', ':', '\'', '\"', ',', '<', '.', '>', '/', '?',
        '`', '~'
    ];

    public static IRuleBuilderOptions<T, string> HasSpecialCharacters<T>(this IRuleBuilder<T, string> ruleBuilder,
        int count = 1)
    {
        return ruleBuilder
            .Must(str => str.Count(c => SpecialCharacters.Contains(c)) >= count)
            .WithMessage("{PropertName} must have at least " + count + " special characters.");
    }
}