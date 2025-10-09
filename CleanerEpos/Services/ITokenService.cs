using CleanerEpos.Models;

namespace CleanerEpos.Services;

public interface ITokenService
{
    public Task<object> GenerateJwtToken(ApplicationUserModel user);
}