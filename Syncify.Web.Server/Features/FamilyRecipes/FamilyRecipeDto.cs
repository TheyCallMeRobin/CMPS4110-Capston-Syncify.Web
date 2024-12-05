using System.Text.Json.Serialization;
using AutoMapper;
using Syncify.Web.Server.Features.Recipes;

namespace Syncify.Web.Server.Features.FamilyRecipes;

public record FamilyRecipeDto
{
    public int FamilyId { get; set; }
    public int RecipeId { get; set; }
}

public record FamilyRecipeGetDto(int CreatedByUserId, RecipeGetDto Recipe) : FamilyRecipeDto;
public record FamilyRecipeCreateDto([property: JsonIgnore] int CreatedByUserId) : FamilyRecipeDto;

public class FamilyRecipeMappingProfile : Profile
{
    public FamilyRecipeMappingProfile()
    {
        CreateMap<FamilyRecipe, FamilyRecipeGetDto>();
        CreateMap<FamilyRecipeCreateDto, FamilyRecipe>();
    }
}