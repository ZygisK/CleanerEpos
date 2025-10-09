namespace CleanerEpos.Models;

public class ApiResult
{
    public ApiResult()
    {
    }

    public ApiResult(bool status)
    {
        this.Success = status;
    }

    public bool Success { get; set; }
    public string ErrorMessage { get; set; }
    public string Message { get; set; }
}