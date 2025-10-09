using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CleanerEpos.Data;
using CleanerEpos.Entities;
using CleanerEpos.Services;
using CleanerEpos.Models;

namespace CleanerEpos.Controllers;

[Route("api/[controller]")]
public class AccountController : BaseController
{
    private readonly ILogger<AccountController> _logger;
    private readonly IUserService _userService;
    private readonly IMapper _mapper;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly ITokenService _tokenService;
    private readonly RoleManager<ApplicationRole> _roleManager;
    private readonly ApplicationDbContext _context;


    public AccountController(ILogger<AccountController> logger,
        IUserService userService, IMapper mapper,
        UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager,
        ITokenService tokenService, RoleManager<ApplicationRole> roleManager,
        ApplicationDbContext context) : base(logger)
    {
        _logger = logger;
        _userService = userService;
        _mapper = mapper;
        _userManager = userManager;
        _signInManager = signInManager;
        _tokenService = tokenService;
        _roleManager = roleManager;
        _context = context;
    }

    [AllowAnonymous]
    [HttpPost]
    [Route("login")]
    public async Task<IActionResult> Login([FromBody] LoginModel model)
    {
        var appUser = await _userManager.FindByNameAsync(model.UserName);
        if (appUser == null)
        {
            _logger.LogWarning("Login Failed - user not found {UserEmail}", model.UserName);
            return BadRequest("Invalid Login Attempt");
        }

        _logger.LogInformation("Login Attempted from {UserEmail}", appUser.UserName);

        var result = await _signInManager.CheckPasswordSignInAsync(appUser, model.Password, false);
        if (result.Succeeded)
        {
            var userModel = _mapper.Map<ApplicationUserModel>(appUser);
            var token = await _tokenService.GenerateJwtToken(userModel);

            _logger.LogInformation("Login Success {UserEmail}", model.UserName);

            return Ok(new
            {
                token = token,
                user = userModel
            });
        }

        _logger.LogWarning("Login Failed from {UserEmail}", model.UserName);
        return BadRequest("Invalid Login Attempt");
    }

    [AllowAnonymous]
    [HttpPost]
    [Route("login/{userId:guid}")]
    public async Task<IActionResult> LoginPosUser([FromBody] PasswordChangeModel model, Guid userId)
    {
        var appUser = await _userManager.FindByIdAsync(userId.ToString());
        if (appUser == null)
        {
            return BadRequest("Invalid Login Attempt");
        }

        _logger.LogInformation("Login Attempted from {UserEmail}", appUser.UserName);

        var result = await _signInManager.CheckPasswordSignInAsync(appUser, model.Password, false);
        if (result.Succeeded)
        {
            var userModel = _mapper.Map<ApplicationUserModel>(appUser);
            var token = await _tokenService.GenerateJwtToken(userModel);

            _logger.LogInformation("Login Success {UserEmail}", appUser.UserName);

            return Ok(new
            {
                token = token,
                user = userModel
            });
        }

        _logger.LogWarning("Login Failed from {UserEmail}", appUser.UserName);
        return BadRequest("Invalid Login Attempt");
    }

    [HttpGet]
    [Route("role")]
    public ActionResult GetRoles()
    {
        var roles = _roleManager.Roles.ToList();
        var roleList = _mapper.Map<List<ApplicationRoleModel>>(roles);
        return Ok(roleList);
    }

    [HttpGet]
    [Route("me")]
    public async Task<ActionResult> GetUser()
    {
        var userId = _userService.GetCurrentUserId();
        var user = await _userManager.FindByIdAsync(userId.ToString());
        var me = await _userService.GetUserById(userId);
        var roleNames = await _userManager.GetRolesAsync(user);
        me.Roles = roleNames;

        return Ok(me);
    }

    [HttpPost]
    [Route("passw/{id}")]
    public async Task<ActionResult> SetUserPassword(Guid id, [FromBody] PasswordChangeModel model)
    {
        var user = await _userManager.FindByIdAsync(id.ToString());
        if (user == null)
        {
            _logger.LogWarning($"SetUserPassword failed: User {id} not found.");
            return BadRequest("User not found");
        }

        _logger.LogInformation($"User found: {user.UserName}");
        
        var hasPassword = await _userManager.HasPasswordAsync(user);

        IdentityResult result;

        if (hasPassword)
        {
            result = await _userManager.RemovePasswordAsync(user);
            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                return BadRequest($"Failed to remove old password: {errors}");
            }
        }
        
        result = await _userManager.AddPasswordAsync(user, model.Password);

        if (result.Succeeded)
        {
            return Ok(new { message = "Password set successfully" });
        }
        else
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            return BadRequest($"Failed to set password: {errors}");
        }
    }
}