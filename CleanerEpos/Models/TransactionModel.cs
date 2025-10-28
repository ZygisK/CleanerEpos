namespace CleanerEpos.Models;

public class TransactionItemModel
{
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal TotalPrice { get; set; }
    public ProductModel? Product { get; set; } //if we want to show products
}

public class TransactionModel
{
    public Guid Id { get; set; }
    public Guid? UserId { get; set; }
    public DateTime CreatedAt { get; set; }
    public decimal TotalAmount { get; set; }
    public string Status { get; set; } = "Pending";
    public List<TransactionItemModel> Items { get; set; } = new();
}