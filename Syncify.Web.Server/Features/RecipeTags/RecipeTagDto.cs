namespace Syncify.Web.Server.Features.RecipeTags;

public record RecipeTagDto(int Id, string Name, int RecipeId);

public record RecipeTagCreateDto(string Name, int RecipeId);