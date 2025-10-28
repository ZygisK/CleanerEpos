using CleanerEpos.Interfaces;
using CleanerEpos.Models;
using CleanerEpos.Services;
using Microsoft.AspNetCore.Mvc;

namespace CleanerEpos.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;
    private readonly ILogger<OrdersController> _logger;

    public OrdersController(IOrderService orderService, ILogger<OrdersController> logger)
    {
        _orderService = orderService;
        _logger = logger;
    }

    [HttpPost]
    public async Task<ActionResult> Create([FromBody] OrderModel model)
    {
        var created = await _orderService.CreateOrder(model);
        return Ok(created);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult> Get(Guid id)
    {
        var order = await _orderService.GetOrder(id);
        return order == null ? NotFound() : Ok(order);
    }

    [HttpGet]
    public async Task<ActionResult> GetAll()
    {
        var orders = await _orderService.GetAllOrders();
        return Ok(orders);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        var success = await _orderService.DeleteOrder(id);
        return success ? Ok() : NotFound();
    }
}