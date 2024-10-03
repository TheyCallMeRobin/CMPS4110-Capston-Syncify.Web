using AutoMapper;
using FluentValidation;

namespace Syncify.Web.Server.Features.ShoppingListItems;

public record ShoppingListItemGetDto(int Id, string Name, bool Checked, int ShoppingListId, int UserId);
public record ShoppingListItemCreateDto(string Name, bool Checked, int ShoppingListId, int UserId);
public record ShoppingListItemUpdateDto(int Id, string Name, bool Checked);

public class ShoppingListItemMappingProfile : Profile
{
    public ShoppingListItemMappingProfile()
    {
        CreateMap<ShoppingListItem, ShoppingListItemGetDto>();
        CreateMap<ShoppingListItemCreateDto, ShoppingListItem>();
        CreateMap<ShoppingListItemUpdateDto, ShoppingListItem>();
    }
}

public class ShoppingListItemCreateDtoValidator : AbstractValidator<ShoppingListItemCreateDto>
{
    public ShoppingListItemCreateDtoValidator()
    {
        RuleFor(x => x.Name).MaximumLength(128).NotEmpty();
        RuleFor(x => x.Checked);
        RuleFor(x => x.ShoppingListId).GreaterThan(0);
        RuleFor(x => x.UserId).GreaterThan(0);
    }
}

public class ShoppingListItemUpdateDtoValidator : AbstractValidator<ShoppingListItemUpdateDto>
{
    public ShoppingListItemUpdateDtoValidator()
    {
        RuleFor(x => x.Name).MaximumLength(128).NotEmpty();
        RuleFor(x => x.Checked).NotNull();
    }
}
