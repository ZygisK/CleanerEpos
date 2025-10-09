namespace CleanerEpos.Entities;

public abstract class BaseEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public DateTime Created { get; set; }
    public DateTime? Modified { get; set; }
}

public class BaseEntityFile : BaseEntity
{
    public bool Active { get; set; } = true;
    public string? ButtonText { get; set; }
    public int SortOrder { get; set; }
}