namespace CleanerEpos.Models;

public class ProductModel
{
    public Guid Id { get; set; }
    public string? Name { get; set; }
    public string? CategoryName { get; set; }
    public Guid? CategoryId { get; set; }
    public decimal Price { get; set; }
    public string? ImageUrl { get; set; }
    public bool Active { get; set; } = true;
}