namespace CleanerEpos.Models;

public class AppSettings
{
    public string JwtKey { get; set; } = string.Empty;
    public string JwtIssuer { get; set; } = string.Empty;
    public string JwtExpireDays { get; set; } = string.Empty;
    public string RootPassword { get; set; } = string.Empty;
    public TimeSpan AlertCheckInterval { get; set; }
}

