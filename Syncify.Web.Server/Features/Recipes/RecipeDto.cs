using System.Text.Json.Serialization;
using AutoMapper;
using FluentValidation;

namespace Syncify.Web.Server.Features.Recipes;

public record RecipeDto
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int? PrepTimeInSeconds { get; set; }
    public int? CookTimeInSeconds { get; set; }
    public int? Servings { get; set; }
    public int? Feeds { get; set; }
    public List<string> Instructions { get; set; } = [];
}

public record RecipeGetDto(int Id, string CreatedByUserFullName) : RecipeDto;
public record RecipeCreateDto([property: JsonIgnore] int CreatedByUserId) : RecipeDto;

public record RecipeUpdateDto([property: JsonIgnore] int Id) : RecipeDto;

public record RecipeQuery
{
    public int? CreatedByUserId { get; set; }
    public int? CookTimeLowerBound { get; set; }
    public int? CookTimeUpperBound { get; set; }
    public int? PrepTimeLowerBound { get; set; }
    public int? PrepTimeUpperBound { get; set; }
    public string? Name { get; set; }
    public List<int>? TagIds { get; set; }
}

public class RecipeMappingProfile : Profile
{
    public RecipeMappingProfile()
    {
        CreateMap<Recipe, RecipeGetDto>();
        CreateMap<RecipeCreateDto, Recipe>();
        CreateMap<RecipeUpdateDto, Recipe>();
    }
}

public class RecipeCreateDtoValidator : AbstractValidator<RecipeCreateDto>
{
    public RecipeCreateDtoValidator()
    {
        RuleFor(x => x.Name)
            .MaximumLength(RecipeEntityConfiguration.NameMaxLength)
            .NotEmpty();
        
        RuleFor(x => x.Description)
            .MaximumLength(RecipeEntityConfiguration.DescriptionMaxLength)
            .When(x => !string.IsNullOrWhiteSpace(x.Description));

        RuleFor(x => x.CookTimeInSeconds)
            .GreaterThan(-1)
            .When(x => x.CookTimeInSeconds.HasValue);
        
        RuleFor(x => x.PrepTimeInSeconds)
            .GreaterThan(-1)
            .When(x => x.PrepTimeInSeconds.HasValue);

        RuleFor(x => x.Instructions) 
            .NotNull()
            .WithMessage("Instructions cannot be null.")
            .Must(list => list.Count > 0)
            .WithMessage("Instructions cannot be empty.");    
    }
}