using AutoMapper;
using FluentValidation;

namespace Syncify.Web.Server.Features.ShoppingLists;

public record ShoppingItemGetDto(int Id, string Name, bool Completed, bool Checked);
public record ShoppingItemCreateDto(string Name, bool Completed, bool Checked);

public class ShoppingItemMappingProfile : Profile
{
    public ShoppingItemMappingProfile()
    {
        CreateMap<ShoppingItem, ShoppingItemGetDto>();
        CreateMap<ShoppingItemCreateDto, ShoppingItem>();
    }
}

public class ShoppingItemCreateDtoValidator : AbstractValidator<ShoppingItemCreateDto>
{
    public ShoppingItemCreateDtoValidator()
    {
        RuleFor(x => x.Name).MaximumLength(128).NotEmpty();
    }
}
