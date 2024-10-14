using System.Text.Json.Serialization;
using AutoMapper;

namespace Syncify.Web.Server.Features.FamilyShoppingLists;

public record FamilyShoppingListDto
{
    public int FamilyId { get; set; }
    public int ShoppingListId { get; set; }
}

public record FamilyShoppingListGetDto(int CreatedByUserId) : FamilyShoppingListDto;
public record FamilyShoppingListCreateDto([property: JsonIgnore] int CreatedByUserId) : FamilyShoppingListDto;

public class FamilyShoppingListMappingProfile : Profile
{
    public FamilyShoppingListMappingProfile()
    {
        CreateMap<FamilyShoppingList, FamilyShoppingListGetDto>();
        CreateMap<FamilyShoppingListCreateDto, FamilyShoppingList>();
    }
}