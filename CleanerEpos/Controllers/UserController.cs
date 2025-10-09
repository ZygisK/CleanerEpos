namespace CleanerEpos.Controllers;

using System.Net;
using AutoMapper;
using Entities;
using Models;
using Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
public class UserController : BaseAdminController
{
    private readonly IUserService userService;
    private readonly UserManager<ApplicationUser> userManager;
    private readonly IMapper mapper;
    private readonly RoleManager<ApplicationRole> roleManager;

    public UserController(UserManager<ApplicationUser> userManager,
        IUserService userService,
        IMapper mapper,
        ILogger<UserController> logger,
        RoleManager<ApplicationRole> roleManager) : base(logger)
    {
        this.userService = userService;
        this.userManager = userManager;
        this.mapper = mapper;
        this.roleManager = roleManager;
    }

    [AllowAnonymous]
    [HttpGet]
    public async Task<ActionResult> GetUsers()
    {
        var identities = userManager.Users.ToList();
        var users = mapper.Map<IList<ApplicationUserModel>>(identities);
        if (users != null)
        {
            foreach (var u in users)
            {
                var user = await userManager.FindByIdAsync(u.Id.ToString());
                u.Roles = await userManager.GetRolesAsync(user);
            }
        }

        return Ok(users);
    }

    [HttpGet]
    [Route("{id}")]
    public async Task<ActionResult> GetUser(string id)
    {
        var user = await userManager.FindByIdAsync(id);
        var roleNames = await userManager.GetRolesAsync(user);

        var result = mapper.Map<ApplicationUserModel>(user);
        result.Roles = roleNames;
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult> PostUser([FromBody] ApplicationUserModel model)
    {
        try
        {
            var entity = await userService.SaveUser(model);
            return Ok(entity);
        }
        catch (Exception ex)
        {
            this.logger.LogError(ex, null);
            return StatusCode((int)HttpStatusCode.InternalServerError, ex.Message);
        }
    }

    [HttpDelete]
    [Route("{id}")]
    public async Task<ActionResult> DeleteUser(Guid id)
    {
        await userService.DeleteUser(id);
        return Ok();
    }
}