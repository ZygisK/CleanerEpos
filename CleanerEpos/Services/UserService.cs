namespace CleanerEpos.Services;

using System.Security.Claims;
using AutoMapper;
using CleanerEpos.Data;
using CleanerEpos.Entities;
using CleanerEpos.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.JsonWebTokens;
using Newtonsoft.Json;

public class UserService : ServiceBase, IUserService
{
    private readonly ILogger<UserService> _logger;
    private readonly IHttpContextAccessor http;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<ApplicationRole> _roleManager;

    public UserService(UserManager<ApplicationUser> userManager,
        RoleManager<ApplicationRole> roleManager, IMapper mapper, ILogger<UserService> logger,
        DbContextOptions<ApplicationDbContext> dbOptions, IHttpContextAccessor http) :
        base(mapper, dbOptions)
    {
        _logger = logger;
        this.http = http;
        _userManager = userManager;
        _roleManager = roleManager;
    }

    private ClaimsPrincipal? GetUser()
    {
        return http.HttpContext?.User ?? null;
    }

    public Guid GetCurrentUserId()
    {
        var user = GetUser();

        var claim = user?
            .FindFirst(x => x.Type.Equals(JwtRegisteredClaimNames.Sid));
        if (claim != null) return Guid.Parse(claim.Value);

        string deb = JsonConvert.SerializeObject(user,
            Formatting.Indented,
            new JsonSerializerSettings()
            {
                ReferenceLoopHandling = ReferenceLoopHandling.Ignore
            });

        throw new InvalidOperationException("claims permission error");
    }

    public async Task<ApplicationUserModel> SaveUser(ApplicationUserModel model)
    {
        IdentityResult result;
        ApplicationUser user;
        if (model.Id == Guid.Empty || model.Id == default(Guid))
        {
            user = mapper.Map<ApplicationUser>(model);
            user.EmailConfirmed = true;
        
            result = await _userManager.CreateAsync(user);
        }
        else
        {
            user = await _userManager.FindByIdAsync(model.Id.ToString());
            if (user != null)
            {
                mapper.Map(model, user);
                result = await _userManager.UpdateAsync(user);
            }
            else
            {
                throw new ApplicationException("User not found");
            }
        }
        
        if (model.Roles != null)
        {
            var roles = _roleManager.Roles.ToList();
            foreach (var role in roles)
            {
                if (await _userManager.IsInRoleAsync(user, role.Name))
                {
                    await _userManager.RemoveFromRoleAsync(user, role.Name);
                }
            }

            for (int i = 0; i < model.Roles.Count(); i++)
            {
                var item = model.Roles[i];
                await _userManager.AddToRoleAsync(user, item);
            }
        }

        _logger.LogInformation(JsonConvert.SerializeObject(result));

        if (result.Succeeded)
        {
            var record = await GetUserById(Guid.Parse(user.Id));
            return record;
        }

        throw new ApplicationException(result.Errors.ToString());
    }

    public async Task<ApplicationUserModel> GetUserById(Guid id)
    {
        var user = await _userManager.FindByIdAsync(id.ToString());
        var xx = mapper.Map<ApplicationUserModel>(user);
        return xx;
    }

    public string GetCurrentUserName()
    {
        throw new NotImplementedException();
    }

    public async Task<bool> DeleteUser(Guid id)
    {
        var user = await _userManager.FindByIdAsync(id.ToString());
        var result = await _userManager.DeleteAsync(user);
        return result.Succeeded;
    }
}