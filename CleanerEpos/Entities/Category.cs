using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CleanerEpos.Entities;

public class Category : BaseEntityFile
{
    public string Name { get; set; }
    public string? Description { get; set; }
    
    public Guid? BaseCategoryId { get; set; }
    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
    
    public string Icon { get; set; } = string.Empty;
}

public class CategoryConfig : IEntityTypeConfiguration<Category>
{
    public void Configure(EntityTypeBuilder<Category> builder)
    {
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Description).IsRequired(false);

        builder.HasMany(x => x.Products)
            .WithOne(x => x.Category)
            .HasForeignKey(x => x.CategoryId);
    }
}