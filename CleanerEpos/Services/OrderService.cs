using AutoMapper;
using CleanerEpos.Data;
using CleanerEpos.Entities;
using CleanerEpos.Models;
using Microsoft.EntityFrameworkCore;

namespace CleanerEpos.Services;

public class OrderService : IOrderService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public OrderService(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<OrderModel> CreateOrder(OrderModel model)
    {
        var entity = _mapper.Map<Order>(model);
        entity.Id = Guid.NewGuid();
        entity.CreatedAt = DateTime.UtcNow;

        foreach (var item in entity.Items)
        {
            item.Id = Guid.NewGuid();
            item.OrderId = entity.Id;
        }

        entity.TotalAmount = entity.Items.Sum(i => i.TotalPrice);

        await _context.Orders.AddAsync(entity);
        await _context.SaveChangesAsync();

        return _mapper.Map<OrderModel>(entity);
    }
    
    public async Task<OrderModel?> GetOrder(Guid id)
    {
        var order = await _context.Orders
            .Include(o => o.Items)
            .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(o => o.Id == id);

        return order == null ? null : _mapper.Map<OrderModel>(order);
    }

    public async Task<List<OrderModel>> GetAllOrders()
    {
        var orders = await _context.Orders
            .Include(o => o.Items)
            .ThenInclude(i => i.Product)
            .ToListAsync();

        return _mapper.Map<List<OrderModel>>(orders);
    }

    public async Task<bool> DeleteOrder(Guid id)
    {
        var order = await _context.Orders.FindAsync(id);
        if (order == null) return false;

        _context.Orders.Remove(order);
        await _context.SaveChangesAsync();
        return true;
    }
}