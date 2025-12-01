namespace UberEats.Application.Common;

public class UploadResult // In this class, we can add more properties in the future if needed
{
    public bool IsSuccess { get; set; }
    public string OriginalFileName { get; set; } = string.Empty;
    public string RelativeFilePath { get; set; } = string.Empty;
    public string ErrorMessage { get; set; } = string.Empty;

}
