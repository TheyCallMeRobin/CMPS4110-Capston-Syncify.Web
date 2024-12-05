using System.Text.Json.Serialization;
using AutoMapper;
using Syncify.Web.Server.Features.ShoppingLists;

namespace Syncify.Web.Server.Features.FamilyShoppingLists;

public record FamilyShoppingListDto
{
    public int FamilyId { get; set; }
    public int ShoppingListId { get; set; }
}

public record FamilyShoppingListGetDto(int CreatedByUserId, ShoppingListGetDto ShoppingList) : FamilyShoppingListDto;
public record FamilyShoppingListCreateDto([property: JsonIgnore] int CreatedByUserId) : FamilyShoppingListDto;

public class FamilyShoppingListMappingProfile : Profile
{
    public FamilyShoppingListMappingProfile()
    {
        CreateMap<FamilyShoppingList, FamilyShoppingListGetDto>();
        CreateMap<FamilyShoppingListCreateDto, FamilyShoppingList>();
    }
}