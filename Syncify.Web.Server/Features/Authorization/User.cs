﻿using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Syncify.Web.Server.Features.Recipes;

namespace Syncify.Web.Server.Features.Authorization;

public class User : IdentityUser<int>
{
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public ICollection<UserRole> UserRoles { get; set; } = [];
    public ICollection<Recipe> Recipes { get; set; } = [];

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
        
        builder.HasMany(u => u.Recipes)
            .WithOne(r => r.User)
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}