using AutoMapper;
using FluentValidation;
using Syncify.Web.Server.Common;
using Syncify.Web.Server.Extensions;

namespace Syncify.Web.Server.Features.RecipeIngredients;

public record RecipeIngredientDto
{
    public string Name { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public string Unit { get; set; } = string.Empty;
}

public record RecipeIngredientGetDto(int Id, int RecipeId) : RecipeIngredientDto;

public record RecipeIngredientCreateDto(int RecipeId) : RecipeIngredientDto;

public record RecipeIngredientUpdateDto : RecipeIngredientDto
{
    public int RecipeId { get; set; }
}

public class RecipeIngredientMappingProfile : Profile
{
    public RecipeIngredientMappingProfile()
    {
        CreateMap<RecipeIngredient, RecipeIngredientGetDto>();
        CreateMap<RecipeIngredientCreateDto, RecipeIngredient>();
        CreateMap<RecipeIngredientUpdateDto, RecipeIngredient>();
    }
}

public class RecipeIngredientDtoValidator : AbstractValidator<RecipeIngredientDto>
{
    public RecipeIngredientDtoValidator()
    {
        RuleFor(x => x.Name).MaximumLength(RecipeIngredientEntityConfiguration.RecipeIngredientNameMaxLength);
        RuleFor(x => x.Unit).Must(value => Enum.IsDefined(typeof(Units), value));
        RuleFor(x => x.Quantity).GreaterThan(0);
    }
}

public class RecipeIngredientCreateDtoValidator : AbstractValidator<RecipeIngredientCreateDto>
{
    public RecipeIngredientCreateDtoValidator()
    {
        Include(new RecipeIngredientDtoValidator());
    }
}

public class RecipeIngredientUpdateDtoValidator : AbstractValidator<RecipeIngredientUpdateDto>
{
    public RecipeIngredientUpdateDtoValidator()
    {
        Include(new RecipeIngredientDtoValidator());
    }
}
