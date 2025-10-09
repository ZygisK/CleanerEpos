namespace CleanerEpos.Models;

public class CategoryModel
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public bool Active { get; set; } = true;
}
