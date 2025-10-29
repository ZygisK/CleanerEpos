using CleanerEpos.Models;

namespace CleanerEpos.Services;

public interface ITransactionService
{
    Task<List<TransactionModel>> GetAllTransactions();
    Task<TransactionModel?> GetTransaction(Guid id);
    Task<TransactionModel> SaveTransaction(CreateTransactionModel model);
    Task<bool> DeleteTransaction(Guid id);
}