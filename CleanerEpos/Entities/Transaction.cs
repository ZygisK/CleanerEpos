namespace CleanerEpos.Entities;

public class Transaction
{
    public Guid Id { get; set; }
    public Guid? UserId { get; set; }
    public DateTime CreatedAt { get; set; }
    public decimal TotalAmount { get; set; }
    public string Status { get; set; } = "Pending";

    public ICollection<TransactionItem> Items { get; set; } = new List<TransactionItem>();
}