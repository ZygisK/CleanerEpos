using CleanerEpos.Models;

namespace CleanerEpos.Services;

public interface IProductService
{
    Task<ProductModel?> GetProduct(Guid id);
    Task<IEnumerable<ProductModel>> GetProducts();
    Task<ProductModel> SaveProduct(ProductModel model);
    Task<bool> DeleteProduct(Guid id);
}