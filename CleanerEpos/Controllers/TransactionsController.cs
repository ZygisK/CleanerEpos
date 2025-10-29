using CleanerEpos.Models;
using CleanerEpos.Services;
using Microsoft.AspNetCore.Mvc;

namespace CleanerEpos.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransactionsController : ControllerBase
{
    private readonly ITransactionService _transactionService;

    public TransactionsController(ITransactionService transactionService)
    {
        _transactionService = transactionService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _transactionService.GetAllTransactions();
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _transactionService.GetTransaction(id);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Save([FromBody] CreateTransactionModel model)
    {
        var created = await _transactionService.SaveTransaction(model);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var success = await _transactionService.DeleteTransaction(id);
        if (!success) return NotFound();
        return NoContent();
    }
}