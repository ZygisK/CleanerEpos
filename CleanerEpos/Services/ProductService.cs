using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using CleanerEpos.Data;
using CleanerEpos.Models;
using CleanerEpos.Entities;

namespace CleanerEpos.Services;

public class ProductService : IProductService
{
    private readonly IMapper _mapper;
    private readonly IUserService _userService;
    private readonly ApplicationDbContext _ctx;

    public ProductService(IMapper mapper,
        IUserService userService,
        ApplicationDbContext ctx)

    {
        _mapper = mapper;
        _userService = userService;
        _ctx = ctx;
    }


    public async Task<ProductModel?> GetProduct(Guid id)
    {
        var entity = await _ctx.Products
            .Include(x => x.Category)
            .FirstOrDefaultAsync(x => x.Id == id);

        return _mapper.Map<ProductModel>(entity) ?? null;
    }

    public async Task<IEnumerable<ProductModel>> GetProducts()
    {
        var records = await _ctx.Products
            .Include(x => x.Category)
            .ProjectTo<ProductModel>(_mapper.ConfigurationProvider)
            .ToListAsync();

        return records;
    }

    public async Task<ProductModel> SaveProduct(ProductModel model)
    {
        var entity = await _ctx.Products
            .Include(x => x.Category)
            .Where(x => x.Id == model.Id)
            .FirstOrDefaultAsync();

        if (entity == null)
        {
            entity = _mapper.Map<Product>(model);
            _ctx.Add(entity);
        }
        else
        {
            _mapper.Map(model, entity);
            _ctx.Entry(entity).State = EntityState.Modified;
        }

        await _ctx.SaveChangesAsync();
        
        entity = await _ctx.Products
            .Include(x => x.Category)
            .FirstOrDefaultAsync(x => x.Id == entity.Id);

        return _mapper.Map<ProductModel>(entity);
    }

    public async Task<bool> DeleteProduct(Guid id)
    {
        int i = 0;
        var entity = await _ctx.Products.FirstOrDefaultAsync(x => x.Id == id);
        if (entity != null)
        {
            _ctx.Products.Remove(entity);
            i = await _ctx.SaveChangesAsync();
        }

        return i > 0;
    }
}