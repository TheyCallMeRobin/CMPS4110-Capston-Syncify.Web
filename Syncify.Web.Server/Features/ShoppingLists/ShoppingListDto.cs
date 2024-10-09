using AutoMapper;
using FluentValidation;
using Syncify.Web.Server.Features.ShoppingListItems;

namespace Syncify.Web.Server.Features.ShoppingLists;

<<<<<<< HEAD
public record ShoppingListDto
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
}

public record ShoppingListGetDto : ShoppingListDto
{
    public int Id { get; set; }
    public List<ShoppingListItemGetDto> ShoppingListItems { get; set; } = [];
}
=======
public record ShoppingListGetDto(int Id, string Name, string Description, bool Checked, bool Completed);
>>>>>>> 7f79ed95fd4327e88b820bab0a321e0c010734b2
public record ShoppingListCreateDto(string Name, string Description, int UserId);
public record ShoppingListUpdateDto(string Name, string? Description, bool Checked, bool Completed);



public record ShoppingListRecipeCreateDto(string Name, string Description, int UserId, int RecipeId) 
    : ShoppingListCreateDto(Name, Description, UserId);
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
