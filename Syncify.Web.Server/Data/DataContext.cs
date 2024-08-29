﻿using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Syncify.Web.Server.Features.Authorization; 
using Syncify.Web.Server.Features.Recipes;

namespace Syncify.Web.Server.Data;

public class DataContext : IdentityDbContext<User, Role, int, IdentityUserClaim<int>, UserRole, IdentityUserLogin<int>, IdentityRoleClaim<int>, IdentityUserToken<int>>
{
    public DbSet<ProfileColor> ProfileColors { get; set; }
    public new DbSet<UserRole> UserRoles { get; set; }
    public DbSet<Recipe> Recipes { get; set; }

    public DataContext(DbContextOptions<DataContext> options) : base(options)
    {

    }

    public DataContext()
    {

    }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(DataContext).Assembly);

        modelBuilder.Entity<User>()
                .HasMany(u => u.Recipes)
                .WithOne(r => r.User)
                .HasForeignKey(r => r.CreatorUserId)
                .OnDelete(DeleteBehavior.Cascade);
    }
}
