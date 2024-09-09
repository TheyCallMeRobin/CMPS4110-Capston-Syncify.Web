using AutoMapper;
using FluentValidation;

namespace Syncify.Web.Server.Features.RecipeIngredients;

public record RecipeIngredientDto
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int Quantity { get; set; }
    public string Unit { get; set; } = string.Empty;
}

public record RecipeIngredientGetDto(int Id, int RecipeId) : RecipeIngredientDto;

public record RecipeIngredientCreateDto(int RecipeId) : RecipeIngredientDto;

public record RecipeIngredientUpdateDto : RecipeIngredientDto;

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
        RuleFor(x => x.Unit).Must(x => RecipeUnits.List.Contains(x));
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

public class RecipeIngredientUpdateDtoValidator : AbstractValidator<RecipeIngredientCreateDto>
{
    public RecipeIngredientUpdateDtoValidator()
    {
        Include(new RecipeIngredientDtoValidator());
    }
}