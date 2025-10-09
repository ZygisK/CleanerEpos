using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CleanerEpos.Models;
using CleanerEpos.Services;

namespace CleanerEpos.Controllers;

[Route("api/[Controller]")]
public class ProductsController : BaseController
{
    private readonly IProductService _productService;
    private readonly ILogger _logger;

    public ProductsController(IProductService productService,
        ILogger<ProductsController> logger,
        IHttpContextAccessor httpContextAccessor) : base(logger)
    {
        _productService = productService;
        _logger = logger;
    }

    [HttpGet]
    [Route("{id}")]
    public async Task<ActionResult> Get(Guid id)
    {
        var record = await _productService.GetProduct(id);
        if (record != null) return Ok(record);

        return NoContent();
    }


    [HttpGet]
    public async Task<ActionResult> Get()
    {
        var record = await _productService.GetProducts();
        if (record != null) return Ok(record);

        return NoContent();
    }
    
    [Authorize(Policy = "sys.admin")]
    [HttpPost]
    public async Task<ActionResult> PostProduct([FromBody] ProductModel model)
    {
        try
        {
            var productService = await _productService.SaveProduct(model);
            return Ok(productService);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, null);
            return Problem(ex.Message);
        }
    }

    [Authorize(Policy = "sys.admin")]
    [HttpDelete]
    [Route("{id}")]
    public async Task<ActionResult> DeleteProduct(Guid id)
    {
        var ok = await _productService.DeleteProduct(id);
        if (ok)
        {
            return Ok();
        }

        return BadRequest();
    }
}