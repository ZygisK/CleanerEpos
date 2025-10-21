namespace CleanerEpos.Entities;

public class Order
{
    public Guid Id { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();

    public decimal TotalAmount { get; set; }

    public string Status { get; set; } = ""; // Pending, Completed, Cancelled
    
    public int TableNumber { get; set; }  // or use string if it's "A1", "B2", etc.

    // Optional for making order note
    public string? Notes { get; set; }
}