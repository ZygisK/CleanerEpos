namespace CleanerEpos.Models;

public class CreateTransactionModel
{
    public Guid? UserId { get; set; }
    public string Status { get; set; } = "Pending";
    public List<CreateTransactionItemModel> Items { get; set; } = new();
}

public class CreateTransactionItemModel
{
    public Guid ProductId { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal TotalPrice { get; set; }
}