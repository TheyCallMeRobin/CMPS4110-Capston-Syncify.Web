using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Syncify.Web.Server.Features.Recipes;
using Syncify.Web.Server.Features.ShoppingLists;

namespace Syncify.Web.Server.Features.Authorization;

public class User : IdentityUser<int>
{
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public List<UserRole> UserRoles { get; set; } = [];
    public List<Recipe> Recipes { get; set; } = [];
    public ICollection<ShoppingList> ShoppingLists { get; set; } = new List<ShoppingList>();

}

public class UserEntityConfiguration : IEntityTypeConfiguration<User>
{
    public const int FirstNameMaxLength = 128;
    public const int LastNameMaxLength = 128;

    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.Property(x => x.FirstName).HasMaxLength(FirstNameMaxLength);
        builder.Property(x => x.LastName).HasMaxLength(LastNameMaxLength);
        builder.Property(x => x.UserName).IsRequired();
    }
}