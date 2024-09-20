﻿using AutoMapper;
using FluentValidation;

namespace Syncify.Web.Server.Features.Recipes;

// Updated to include new fields and the user's first name
public record RecipeGetDto(int Id, string Name, string Description, int PrepTimeInMinutes, int CookTimeInMinutes, int Servings, string UserFirstName);
public record RecipeCreateDto(string Name, string Description, int PrepTimeInMinutes, int CookTimeInMinutes, int Servings, int UserId);

public class RecipeMappingProfile : Profile
{
    public RecipeMappingProfile()
    {
        CreateMap<Recipe, RecipeGetDto>()
            .ForMember(dest => dest.UserFirstName, opt => opt.MapFrom(src => src.User.FirstName)); // Map User's FirstName to UserFirstName
        CreateMap<RecipeCreateDto, Recipe>();
    }
}

public class RecipeCreateDtoValidator : AbstractValidator<RecipeCreateDto>
{
    public RecipeCreateDtoValidator()
    {
        RuleFor(x => x.Name).MaximumLength(128).NotEmpty();
        RuleFor(x => x.Description).MaximumLength(256).NotEmpty(); // Ensure description is capped at 256 characters
        RuleFor(x => x.PrepTimeInMinutes).GreaterThan(0).NotEmpty();
        RuleFor(x => x.CookTimeInMinutes).GreaterThan(0).NotEmpty();
        RuleFor(x => x.Servings).GreaterThan(0).NotEmpty();
    }
}
