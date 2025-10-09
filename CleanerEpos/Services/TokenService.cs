using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AutoMapper;
using CleanerEpos.Entities;
using CleanerEpos.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace CleanerEpos.Services;

public class TokenService : ITokenService
{
    private readonly AppSettings _config;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<ApplicationRole> _roleManager;
    private readonly IMapper _mapper;

    public TokenService(IOptions<AppSettings> configOptions, UserManager<ApplicationUser> userManager,
        RoleManager<ApplicationRole> roleManager, IMapper mapper)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _mapper = mapper;
        _config = configOptions.Value;
    }

    public async Task<object> GenerateJwtToken(ApplicationUserModel user)
    {
        var claims = await GetClaims(user);

        claims.AddRange(new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(JwtRegisteredClaimNames.UniqueName, user.FullName),
            new Claim(JwtRegisteredClaimNames.Sid, user.Id.ToString()),
        });
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.JwtKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expires = DateTime.Now.AddDays(Convert.ToDouble(_config.JwtExpireDays));

        var token = new JwtSecurityToken(
            _config.JwtIssuer,
            _config.JwtIssuer,
            claims,
            expires: expires,
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private async Task<List<Claim>> GetClaims(ApplicationUserModel user)
    {
        if (_userManager.SupportsUserRole)
        {
            var entity = _mapper.Map<ApplicationUser>(user);
            var roles = await _userManager.GetRolesAsync(entity);
            var claims = new List<Claim>();
            foreach (var roleName in roles)
            {
                if (_roleManager.SupportsRoleClaims)
                {
                    var role = await _roleManager.FindByNameAsync(roleName);
                    if (role != null)
                    {
                        claims.AddRange(await _roleManager.GetClaimsAsync(role));
                    }
                }
            }

            return claims;
        }

        return new List<Claim>();
    }
}