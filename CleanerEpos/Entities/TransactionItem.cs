namespace CleanerEpos.Entities;

public class TransactionItem
{
    public Guid Id { get; set; }
    public Guid TransactionId { get; set; }
    public Transaction Transaction { get; set; } = default!;
    
    public Guid ProductId { get; set; }
    public Product Product { get; set; } = default!;

    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal TotalPrice { get; set; }
}