using AutoMapper;
using FluentValidation;

namespace Syncify.Web.Server.Features.ShoppingLists;

public record ShoppingListGetDto(int Id, string Name, string Description);
public record ShoppingListCreateDto(string Name, string Description, int UserId);

public class ShoppingListMappingProfile : Profile
{
    public ShoppingListMappingProfile()
    {
        CreateMap<ShoppingList, ShoppingListGetDto>();
        CreateMap<ShoppingListCreateDto, ShoppingList>();
    }
}

public class ShoppingListCreateDtoValidator : AbstractValidator<ShoppingListCreateDto>
{
    public ShoppingListCreateDtoValidator()
    {
        RuleFor(x => x.Name).MaximumLength(128).NotEmpty();
        RuleFor(x => x.Description).MaximumLength(1024);
    }
}
