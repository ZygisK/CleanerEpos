using CleanerEpos.Models;

namespace CleanerEpos.Services;

public interface IUserService
{
    Task<ApplicationUserModel> SaveUser(ApplicationUserModel model);
    Guid GetCurrentUserId();
    Task<ApplicationUserModel> GetUserById(Guid id);

    string GetCurrentUserName();

    Task<bool> DeleteUser(Guid id);
}