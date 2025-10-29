using AutoMapper;
using CleanerEpos.Data;
using CleanerEpos.Entities;
using CleanerEpos.Models;
using Microsoft.EntityFrameworkCore;

namespace CleanerEpos.Services;

public class TransactionService : ITransactionService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public TransactionService(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<List<TransactionModel>> GetAllTransactions()
    {
        var transactions = await _context.Transactions
            .Include(t => t.Items)
            .ThenInclude(i => i.Product)
            .ToListAsync();

        return _mapper.Map<List<TransactionModel>>(transactions);
    }

    public async Task<TransactionModel?> GetTransaction(Guid id)
    {
        var transaction = await _context.Transactions
            .Include(t => t.Items)
            .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(t => t.Id == id);

        return transaction == null ? null : _mapper.Map<TransactionModel>(transaction);
    }

    public async Task<TransactionModel> SaveTransaction(CreateTransactionModel model)
    {
        var entity = new Transaction
        {
            Id = Guid.NewGuid(),
            CreatedAt = DateTime.UtcNow,
            Status = model.Status ?? "Completed",
            TotalAmount = model.Items.Sum(i => i.TotalPrice),
            Items = model.Items.Select(i => new TransactionItem
            {
                Id = Guid.NewGuid(),
                ProductId = i.ProductId,
                Quantity = i.Quantity,
                UnitPrice = i.UnitPrice,
                TotalPrice = i.TotalPrice
            }).ToList()
        };
        
        _context.Transactions.Add(entity);
        
        await _context.SaveChangesAsync();
        
        entity = await _context.Transactions
            .Include(t => t.Items)
            .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(x => x.Id == entity.Id);

        return _mapper.Map<TransactionModel>(entity);
    }

    public async Task<bool> DeleteTransaction(Guid id)
    {
        var transaction = await _context.Transactions
            .Include(t => t.Items)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (transaction == null)
            return false;

        _context.TransactionItems.RemoveRange(transaction.Items);
        _context.Transactions.Remove(transaction);
        await _context.SaveChangesAsync();

        return true;
    }
}
