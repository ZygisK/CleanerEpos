using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CleanerEpos.Entities;

public class Product : BaseEntityFile
{
    public Guid Id { get; set; }
    public string? Name { get; set; }
    public string? CategoryName { get; set; }
    public Guid? CategoryId { get; set; }
    public decimal Price { get; set; }
    public string? ImageUrl { get; set; }
    public bool Active { get; set; } = true;
    public virtual Category Category { get; set; }
}

public class ProductConfig : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.HasKey(x => x.Id);
        builder.Property(x => x.CategoryId).IsRequired(false);
    }
}