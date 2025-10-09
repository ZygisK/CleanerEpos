namespace CleanerEpos.Controllers;

using Microsoft.AspNetCore.Mvc;

public class BaseController : Controller
{
    protected readonly ILogger logger;

    public BaseController(ILogger logger)
    {
        this.logger = logger;
    }
}

[ApiController]
public class BaseAdminController : Controller
{
    protected readonly ILogger logger;

    public BaseAdminController(ILogger logger)
    {
        this.logger = logger;
    }
}