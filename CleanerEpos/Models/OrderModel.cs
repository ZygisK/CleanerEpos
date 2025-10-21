namespace CleanerEpos.Models;

public class OrderModel
{
    public Guid Id { get; set; }

    public DateTime CreatedAt { get; set; }

    public int TableNumber { get; set; }

    public List<OrderItemModel> Items { get; set; } = new();

    public decimal TotalAmount { get; set; }

    public string Status { get; set; }

    public string? Notes { get; set; }
}
