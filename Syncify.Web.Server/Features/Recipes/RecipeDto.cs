using AutoMapper;
using FluentValidation;
using Syncify.Web.Server.Features.RecipeIngredients;
using Syncify.Web.Server.Features.RecipeTags;

namespace Syncify.Web.Server.Features.Recipes;

public record RecipeIngredientDto(int Id, string Name, string Unit, string? Description, int Quantity);

public record RecipeTagDto(int Id, string Name, int RecipeId);

public record RecipeGetDto(int Id, string Name, string Description, int PrepTimeInMinutes, int CookTimeInMinutes, int Servings, string UserFirstName, int UserId, List<RecipeIngredientDto> Ingredients, List<RecipeTagDto> Tags);

public record RecipeCreateDto(string Name, string Description, int PrepTimeInMinutes, int CookTimeInMinutes, int Servings, int UserId, List<RecipeIngredientDto> Ingredients, List<RecipeTagDto> Tags);


public class RecipeMappingProfile : Profile
{
    public RecipeMappingProfile()
    {
        CreateMap<Recipe, RecipeGetDto>()
            .ForMember(dest => dest.UserFirstName, opt => opt.MapFrom(src => src.User.FirstName))
            .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.UserId))
            .ForMember(dest => dest.Ingredients, opt => opt.MapFrom(src => src.Ingredients))
            .ForMember(dest => dest.Tags, opt => opt.MapFrom(src => src.Tags)); 

        CreateMap<RecipeCreateDto, Recipe>()
            .ForMember(dest => dest.Ingredients, opt => opt.Ignore()) 
            .ForMember(dest => dest.Tags, opt => opt.Ignore()); 

        CreateMap<RecipeIngredient, RecipeIngredientDto>();
        CreateMap<RecipeIngredientDto, RecipeIngredient>();
        CreateMap<RecipeTag, RecipeTagDto>();
        CreateMap<RecipeTagDto, RecipeTag>();
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
