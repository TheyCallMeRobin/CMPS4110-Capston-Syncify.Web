using System.Text.Json.Serialization;
using AutoMapper;
using FluentValidation;
using Syncify.Web.Server.Features.FamilyMembers;
using Syncify.Web.Server.Features.FamilyRecipes;
using Syncify.Web.Server.Features.FamilyShoppingLists;

namespace Syncify.Web.Server.Features.Families;

public record FamilyDto
{
    public string Name { get; set; } = string.Empty;
}

public record FamilyGetDto(int Id, string Identifier, int CreatedByUserId, 
    List<FamilyMemberGetDto> FamilyMembers, 
    List<FamilyRecipeGetDto> FamilyRecipes, 
    List<FamilyShoppingListGetDto> FamilyShoppingLists) : FamilyDto;

public record FamilyCreateDto([property: JsonIgnore] int CreatedByUserId) : FamilyDto;

public record FamilyUpdateDto : FamilyDto;

public class FamilyMappingProfile : Profile
{
    public FamilyMappingProfile()
    {
        CreateMap<Family, FamilyGetDto>();
        CreateMap<FamilyCreateDto, Family>();
        CreateMap<FamilyUpdateDto, Family>();
    }
}

public class FamilyDtoValidator : AbstractValidator<FamilyDto>
{
    public FamilyDtoValidator()
    {
        RuleFor(x => x.Name)
            .MaximumLength(FamilyEntityConfiguration.NameMaxLength)
            .NotEmpty();
    }
}

public class FamilyCreateDtoValidator : AbstractValidator<FamilyCreateDto>
{
    public FamilyCreateDtoValidator()
    {
        Include(new FamilyDtoValidator());
    }
}

public class FamilyUpdateDtoValidator : AbstractValidator<FamilyUpdateDto>
{
    public FamilyUpdateDtoValidator()
    {
        Include(new FamilyDtoValidator());
    }
}