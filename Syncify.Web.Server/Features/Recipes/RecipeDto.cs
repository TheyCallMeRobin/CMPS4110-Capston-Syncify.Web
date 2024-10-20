using AutoMapper;
using FluentValidation;

namespace Syncify.Web.Server.Features.Recipes;

public record RecipeGetDto(int Id, string Name, string Description, int PrepTimeInMinutes, int CookTimeInMinutes, int Servings, string UserFirstName);
public record RecipeCreateDto(string Name, string Description, int PrepTimeInMinutes, int CookTimeInMinutes, int Servings, int UserId);

public class RecipeMappingProfile : Profile
{
    public RecipeMappingProfile()
    {
        CreateMap<Recipe, RecipeGetDto>()
            .ForMember(dest => dest.UserFirstName, opt => opt.MapFrom(src => src.User.FirstName));
        CreateMap<RecipeCreateDto, Recipe>();
    }
}

public class RecipeCreateDtoValidator : AbstractValidator<RecipeCreateDto>
{
    public RecipeCreateDtoValidator()
    {
        RuleFor(x => x.Name).MaximumLength(128).NotEmpty();
        RuleFor(x => x.Description).MaximumLength(256).NotEmpty();
        RuleFor(x => x.PrepTimeInMinutes).GreaterThan(0).NotEmpty();
        RuleFor(x => x.CookTimeInMinutes).GreaterThan(0).NotEmpty();
        RuleFor(x => x.Servings).GreaterThan(0).NotEmpty();
    }
}
