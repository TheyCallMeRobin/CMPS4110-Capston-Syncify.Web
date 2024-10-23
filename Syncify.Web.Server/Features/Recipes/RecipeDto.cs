using AutoMapper;
using FluentValidation;
using Syncify.Web.Server.Features.RecipeIngredients;
using Syncify.Web.Server.Features.RecipeTags;

namespace Syncify.Web.Server.Features.Recipes;

public class RecipeIngredientDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Unit { get; set; }
    public string? Description { get; set; }
    public int Quantity { get; set; }

    // Parameterless constructor (optional, but AutoMapper works fine with classes)
    public RecipeIngredientDto() { }

    public RecipeIngredientDto(int id, string name, string unit, string? description, int quantity)
    {
        Id = id;
        Name = name;
        Unit = unit;
        Description = description;
        Quantity = quantity;
    }
}

public class RecipeTagDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int RecipeId { get; set; }

    // Parameterless constructor (optional, but AutoMapper works fine with classes)
    public RecipeTagDto() { }

    public RecipeTagDto(int id, string name, int recipeId)
    {
        Id = id;
        Name = name;
        RecipeId = recipeId;
    }
}

public class RecipeGetDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public int PrepTimeInMinutes { get; set; }
    public int CookTimeInMinutes { get; set; }
    public int Servings { get; set; }
    public string UserFirstName { get; set; }
    public int UserId { get; set; }
    public List<RecipeIngredientDto> Ingredients { get; set; } = new List<RecipeIngredientDto>();
    public List<RecipeTagDto> Tags { get; set; } = new List<RecipeTagDto>();

    // Default parameterless constructor for AutoMapper projections
    public RecipeGetDto() { }

    public RecipeGetDto(int id, string name, string description, int prepTimeInMinutes, int cookTimeInMinutes, int servings, string userFirstName, int userId, List<RecipeIngredientDto> ingredients, List<RecipeTagDto> tags)
    {
        Id = id;
        Name = name;
        Description = description;
        PrepTimeInMinutes = prepTimeInMinutes;
        CookTimeInMinutes = cookTimeInMinutes;
        Servings = servings;
        UserFirstName = userFirstName;
        UserId = userId;
        Ingredients = ingredients;
        Tags = tags;
    }
}

public class RecipeCreateDto
{
    public string Name { get; set; }
    public string Description { get; set; }
    public int PrepTimeInMinutes { get; set; }
    public int CookTimeInMinutes { get; set; }
    public int Servings { get; set; }
    public int UserId { get; set; }
    public List<RecipeIngredientDto> Ingredients { get; set; } = new List<RecipeIngredientDto>();
    public List<RecipeTagDto> Tags { get; set; } = new List<RecipeTagDto>();

    // Default parameterless constructor for AutoMapper projections
    public RecipeCreateDto() { }

    public RecipeCreateDto(string name, string description, int prepTimeInMinutes, int cookTimeInMinutes, int servings, int userId, List<RecipeIngredientDto> ingredients, List<RecipeTagDto> tags)
    {
        Name = name;
        Description = description;
        PrepTimeInMinutes = prepTimeInMinutes;
        CookTimeInMinutes = cookTimeInMinutes;
        Servings = servings;
        UserId = userId;
        Ingredients = ingredients;
        Tags = tags;
    }
}

public class RecipeMappingProfile : Profile
{
    public RecipeMappingProfile()
    {
        CreateMap<Recipe, RecipeGetDto>()
            .ForMember(dest => dest.UserFirstName, opt => opt.MapFrom(src => src.User.FirstName))
            .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.UserId))
            .ForMember(dest => dest.Ingredients, opt => opt.MapFrom(src => src.RecipeIngredients))
            .ForMember(dest => dest.Tags, opt => opt.MapFrom(src => src.Tags));

        CreateMap<RecipeCreateDto, Recipe>()
            .ForMember(dest => dest.RecipeIngredients, opt => opt.Ignore())
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
