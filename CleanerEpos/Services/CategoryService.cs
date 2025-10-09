using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using CleanerEpos.Data;
using CleanerEpos.Entities;
using CleanerEpos.Interfaces;
using CleanerEpos.Models;

namespace CleanerEpos.Services;

public class CategoryService : ICategoryService
{
    private readonly IMapper _mapper;
    private readonly IUserService _userService;
    private readonly ApplicationDbContext _ctx;

    public CategoryService(IMapper mapper,
        IUserService userService,
        ApplicationDbContext ctx)

    {
        _mapper = mapper;
        _userService = userService;
        _ctx = ctx;
    }

    public async Task<CategoryModel?> GetCategory(Guid id)
    {
        var entity = await _ctx.Categories
            .Include(x => x.Products)
            .FirstOrDefaultAsync(x => x.Id == id);

        return _mapper.Map<CategoryModel>(entity) ?? null;
    }

    public async Task<IEnumerable<CategoryModel>> GetCategories()
    {
        var records = await _ctx.Categories
            .Include(x => x.Products)
            .ProjectTo<CategoryModel>(_mapper.ConfigurationProvider)
            .ToListAsync();

        return records;
    }

    public async Task<CategoryModel> SaveCategory(CategoryModel model)
    {
        var entity = await _ctx.Categories
            .Include(x => x.Products)
            .FirstOrDefaultAsync(x => x.Id == model.Id);

        if (entity == null)
        {
            entity = _mapper.Map<Category>(model);
            _ctx.Add(entity);
        }
        else
        {
            _mapper.Map(model, entity);
            _ctx.Entry(entity).State = EntityState.Modified;
        }

        await _ctx.SaveChangesAsync();
        return _mapper.Map<CategoryModel>(entity);
    }

    public async Task<bool> DeleteCategory(Guid id)
    {
        int i = 0;
        var entity = await _ctx.Categories.FirstOrDefaultAsync(x => x.Id == id);
        if (entity != null)
        {
            _ctx.Categories.Remove(entity);
            i = await _ctx.SaveChangesAsync();
        }

        return i > 0;
    }
}