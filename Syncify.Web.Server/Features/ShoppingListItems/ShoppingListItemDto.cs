using AutoMapper;
using FluentValidation;
using System.ComponentModel.DataAnnotations;

namespace Syncify.Web.Server.Features.ShoppingListItems;

public record ShoppingListItemDto
{
    [Required]
    public string Name { get; set; } = string.Empty;
    [Required]
    public string Unit { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int Quantity { get; set; }
    public bool IsChecked { get; set; }
}

public record ShoppingListItemGetDto(int Id, int ShoppingListId) : ShoppingListItemDto;
public record ShoppingListItemCreateDto(int ShoppingListId) : ShoppingListItemDto;
public record ShoppingListItemUpdateDto : ShoppingListItemDto;

public class ShoppingListItemMappingProfile : Profile
{
    public ShoppingListItemMappingProfile()
    {
        CreateMap<ShoppingListItem, ShoppingListItemGetDto>();
        CreateMap<ShoppingListItemCreateDto, ShoppingListItem>();
        CreateMap<ShoppingListItemUpdateDto, ShoppingListItem>();
    }
}

public class ShoppingListItemDtoValidator : AbstractValidator<ShoppingListItemDto>
{
    public ShoppingListItemDtoValidator()
    {
        RuleFor(x => x.Name).MaximumLength(ShoppingListItemConfiguration.NameMaxLength).NotEmpty();
        RuleFor(x => x.Unit).MaximumLength(ShoppingListItemConfiguration.UnitMaxLength).NotEmpty();
        RuleFor(x => x.Description).MaximumLength(ShoppingListItemConfiguration.DescriptionMaxLength);
        RuleFor(x => x.Quantity).GreaterThan(0);
        RuleFor(x => x.IsChecked).NotNull();
    }
}