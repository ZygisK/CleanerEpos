using CleanerEpos.Models;

namespace CleanerEpos.Interfaces;

public interface ICategoryService
{
    Task<CategoryModel?> GetCategory(Guid id);
    Task<IEnumerable<CategoryModel>> GetCategories();
    Task<CategoryModel> SaveCategory(CategoryModel model);
    Task<bool> DeleteCategory(Guid id);
}