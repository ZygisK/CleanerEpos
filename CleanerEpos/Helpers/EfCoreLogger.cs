namespace CleanerEpos.Helpers;

public static class EFCoreLogger
{
    public static readonly ILoggerFactory Factory
        = LoggerFactory.Create(builder => { builder.AddConsole(); });
}