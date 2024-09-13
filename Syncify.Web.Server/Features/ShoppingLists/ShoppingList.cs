namespace Syncify.Web.Server.Features.ShoppingLists
{
    public class ShoppingListGetDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<ShoppingItemDto> Items { get; set; } = new List<ShoppingItemDto>();
    }

    public class ShoppingListCreateDto
    {
        public string Name { get; set; } = string.Empty;
        public List<ShoppingItemDto> Items { get; set; } = new List<ShoppingItemDto>();
    }

    public class ShoppingItemDto
    {
        public string Name { get; set; } = string.Empty;
        public int Quantity { get; set; }
    }

    }

