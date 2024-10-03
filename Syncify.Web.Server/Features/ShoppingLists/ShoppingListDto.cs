using AutoMapper;
using FluentValidation;
using Syncify.Web.Server.Features.ShoppingListItems;

namespace Syncify.Web.Server.Features.ShoppingLists;

public record ShoppingListGetDto(int Id, string Name, string Description, List<ShoppingListItemGetDto> ShoppingListItems);
public record ShoppingListCreateDto(string Name, string Description, int UserId, List<ShoppingListItemCreateDto> ShoppingListItems);
public record ShoppingListUpdateDto(string Name, string? Description, List<ShoppingListItemUpdateDto> ShoppingListItems);

public class ShoppingListMappingProfile : Profile
{
    public ShoppingListMappingProfile()
    {
        CreateMap<ShoppingList, ShoppingListGetDto>()
            .ForMember(dest => dest.ShoppingListItems, opt => opt.MapFrom(src => src.ShoppingListItems));
        CreateMap<ShoppingListCreateDto, ShoppingList>()
            .ForMember(dest => dest.ShoppingListItems, opt => opt.MapFrom(src => src.ShoppingListItems));
        CreateMap<ShoppingListUpdateDto, ShoppingList>()
            .ForMember(dest => dest.ShoppingListItems, opt => opt.MapFrom(src => src.ShoppingListItems));
    }
}

public class ShoppingListCreateDtoValidator : AbstractValidator<ShoppingListCreateDto>
{
    public ShoppingListCreateDtoValidator()
    {
        RuleFor(x => x.Name).MaximumLength(128).NotEmpty();
        RuleFor(x => x.Description).MaximumLength(1024);
        RuleForEach(x => x.ShoppingListItems).SetValidator(new ShoppingListItemCreateDtoValidator());
    }
}

public class ShoppingListUpdateDtoValidator : AbstractValidator<ShoppingListUpdateDto>
{
    public ShoppingListUpdateDtoValidator()
    {
        RuleFor(x => x.Name).MaximumLength(128).NotEmpty();
        RuleFor(x => x.Description).MaximumLength(1024);
        RuleForEach(x => x.ShoppingListItems).SetValidator(new ShoppingListItemUpdateDtoValidator());
    }
}

