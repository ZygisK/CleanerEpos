using CleanerEpos.Entities;
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
    
    public virtual DbSet<Order> Orders { get; set; }
    public virtual DbSet<OrderItem> OrderItems { get; set; }
    
    public virtual DbSet<Transaction> Transactions { get; set; }
    public virtual DbSet<TransactionItem> TransactionItems { get; set; }


    
    protected override void OnModelCreating(ModelBuilder builder)
    {
        // builder.ApplyConfiguration(new ApplicationUserConfig());
        base.OnModelCreating(builder);
        
        builder.ApplyConfiguration(new ProductConfig());
        builder.ApplyConfiguration(new CategoryConfig());
    }
}