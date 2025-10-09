using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CleanerEpos.Interfaces;
using CleanerEpos.Models;

namespace CleanerEpos.Controllers;

[Route("api/[Controller]")]
public class CategoriesController : BaseController
{
    private readonly ICategoryService _categoryService;

    public CategoriesController(ILogger<CategoriesController> logger,
        ICategoryService categoryService) : base(logger)
    {
        _categoryService = categoryService;
    }

    [HttpGet]
    [Route("{id}")]
    public async Task<ActionResult> GetCategory(Guid id)
    {
        var record = await _categoryService.GetCategory(id);
        if (record != null) return Ok(record);

        return NoContent();
    }


    [HttpGet]
    public async Task<ActionResult> GetCategories()
    {
        var record = await _categoryService.GetCategories();
        if (record != null) return Ok(record);

        return NoContent();
    }

    [Authorize(Policy = "sys.admin")]
    [HttpPost]
    public async Task<ActionResult> PostCategory([FromBody] CategoryModel model)
    {
        try
        {
            var _category = await _categoryService.SaveCategory(model);
            return Ok(_category);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, null);
            return Problem(ex.Message);
        }
    }


    [HttpDelete]
    [Route("{id}")]
    public async Task<ActionResult> DeleteCategory(Guid id)
    {
        var ok = await _categoryService.DeleteCategory(id);
        if (ok)
        {
            return Ok();
        }

        return BadRequest();
    }
}