using System.Security.Claims;
using CleanerEpos.Entities;
using CleanerEpos.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;

namespace CleanerEpos.Helpers;

public static class SecurityDataInitializer
{
    internal static class EPosClaimTypes
    {
        internal static readonly string Permission = "EPOS_permission";
    }

    public static async Task EnsureRootAccess(
        this IHost host)
    {
        using var scope = host.Services.CreateScope();

        var serviceProvider = scope.ServiceProvider;
        var config = serviceProvider.GetRequiredService<IOptions<AppSettings>>();
        var um = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var rm = serviceProvider.GetRequiredService<RoleManager<ApplicationRole>>();

        await EnsureAdminSetup(um, config.Value, rm);
    }

    private static async Task EnsureAdminSetup(UserManager<ApplicationUser> userManager,
        AppSettings settings,
        RoleManager<ApplicationRole> roleManager)
    {
        var user = new ApplicationUser
        {
            UserName = "root",
            Email = "root@email.ie",
            FullName = "root user"
        };
        var account = await userManager.FindByNameAsync(user.UserName);
        if (account == null)
        {
            var result = await userManager.CreateAsync(user, settings.RootPassword);
            if (result.Succeeded)
            {
                account = await userManager.FindByNameAsync(user.UserName);
            }
        }


        if (!roleManager.RoleExistsAsync("sys.admin").Result)
        {
            ApplicationRole role = new ApplicationRole
            {
                Name = "sys.admin"
            };
            IdentityResult roleResult = roleManager.CreateAsync(role).Result;
            var systemAdmin = roleManager.FindByNameAsync("sys.admin").Result;
            var x = roleManager.AddClaimAsync(systemAdmin,
                new Claim(EPosClaimTypes.Permission, "sys.admin")).Result;
        }


        if (!roleManager.RoleExistsAsync("guest").Result)
        {
            ApplicationRole role = new ApplicationRole
            {
                Name = "guest"
            };
            IdentityResult roleResult = roleManager.CreateAsync(role).Result;
            var applicationRole = roleManager.FindByNameAsync("guest").Result;
            var x = roleManager.AddClaimAsync(applicationRole,
                new Claim(EPosClaimTypes.Permission, "guest")).Result;
        }


        if (!roleManager.RoleExistsAsync("touch.user").Result)
        {
            ApplicationRole role = new ApplicationRole
            {
                Name = "touch.user"
            };
            IdentityResult roleResult = roleManager.CreateAsync(role).Result;
            var applicationRole = roleManager.FindByNameAsync("touch.user").Result;
            var x = roleManager.AddClaimAsync(applicationRole,
                new Claim(EPosClaimTypes.Permission, "touch.user")).Result;
        }

        if (account != null && !(await userManager.IsInRoleAsync(account, "sys.admin")))
        {
            await userManager.AddToRoleAsync(account, "sys.admin");
        }
    }
}