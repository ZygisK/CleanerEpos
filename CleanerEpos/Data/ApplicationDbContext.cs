using System.Transactions;
using CleanerEpos.Entities;
using CleanerEpos.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace CleanerEpos.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, string>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public virtual DbSet<Product> Products { get; set; }
    public virtual DbSet<Category> Categories { get; set; }
    
    protected override void OnModelCreating(ModelBuilder builder)
    {
        // builder.ApplyConfiguration(new ApplicationUserConfig());
        base.OnModelCreating(builder);
        
        builder.ApplyConfiguration(new ProductConfig());
        builder.ApplyConfiguration(new CategoryConfig());
    }
}