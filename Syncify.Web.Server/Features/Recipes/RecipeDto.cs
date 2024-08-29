using AutoMapper;
using FluentValidation;

namespace Syncify.Web.Server.Features.Recipes;

public record RecipeGetDto(int Id, string Name, string Description);
public record RecipeCreateDto(string Name, string Description);

public class RecipeMappingProfile : Profile
{
    public RecipeMappingProfile()
    {
        CreateMap<Recipe, RecipeGetDto>();
        CreateMap<RecipeCreateDto, Recipe>();
        
        CreateProjection<Recipe, RecipeGetDto>();
    }
}

public class RecipeCreateDtoValidator : AbstractValidator<RecipeCreateDto>
{
    public RecipeCreateDtoValidator()
    {
        RuleFor(x => x.Name).MaximumLength(128).NotEmpty();
        RuleFor(x => x.Description).MaximumLength(1024);
    }
}