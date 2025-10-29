using CleanerEpos.Models;

namespace CleanerEpos.Services;

public interface IOrderService
{
    Task<OrderModel> SaveOrder(OrderModel model);
    Task<OrderModel?> GetOrder(Guid id);
    Task<List<OrderModel>> GetAllOrders();
    Task<bool> DeleteOrder(Guid id);
}