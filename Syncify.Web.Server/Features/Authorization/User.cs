using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Syncify.Web.Server.Features.Families;
using Syncify.Web.Server.Features.Recipes;
using Syncify.Web.Server.Features.ShoppingLists;

namespace Syncify.Web.Server.Features.Authorization;

public class User : IdentityUser<int>
{
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public string FullName { get; set; } = string.Empty;
    public new string Email { get; set; } = string.Empty;
    public new string PhoneNumber { get; set; } = string.Empty;
    public Guid MemberIdentifier { get; init; } = Guid.NewGuid();
    public List<UserRole> UserRoles { get; set; } = [];
    public List<Recipe> Recipes { get; set; } = [];
    public List<Family> Families { get; set; } = [];
    public ICollection<ShoppingList> ShoppingLists { get; set; } = new List<ShoppingList>();
}

public class UserEntityConfiguration : IEntityTypeConfiguration<User>
{
    internal const int FirstNameMaxLength = 128;
    internal const int LastNameMaxLength = 128;
    
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.Property(x => x.FirstName).HasMaxLength(FirstNameMaxLength);
        builder.Property(x => x.LastName).HasMaxLength(LastNameMaxLength);

        builder
            .Property(x => x.FullName)
            .HasComputedColumnSql("[FirstName] + ' ' + [LastName]");
        
        builder
            .Property(x => x.MemberIdentifier)
            .ValueGeneratedOnAdd()
            .HasDefaultValueSql("NEWID()");
        
        builder.Property(x => x.UserName).IsRequired();
        
        builder.HasIndex(x => x.MemberIdentifier);
        builder.HasIndex(x => x.FullName);
        builder.HasIndex(x => x.Email).IsUnique();
        builder.HasIndex(x => x.PhoneNumber).IsUnique();
        
        builder.HasIndex(x => new { x.Email, x.PhoneNumber, x.MemberIdentifier });
    }
}