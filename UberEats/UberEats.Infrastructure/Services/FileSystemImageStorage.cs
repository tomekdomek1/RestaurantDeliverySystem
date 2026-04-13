using UberEats.Domain.Interfaces;

namespace UberEats.Infrastructure.Services;

public class FileSystemImageStorage : IFileStorage
{
    private readonly string _basePath = "C:/PzProject/images"; // Could be from config or environment variable or elsewhere, hardcoded for simplicity,

    public bool IsFileValid(string contentType, long length)
    {
        //TODO: Add more allowed types if needed
        var allowedTypes = new List<string> { "image/jpeg" };
        var maxSizeInBytes = 5 * 1024 * 1024; // 5 MB
        if (!allowedTypes.Contains(contentType))
        {
            return false;
        }
        if (length > maxSizeInBytes)
        {
            return false;
        }
        return true;
    }

    public async Task<string> SaveAsync(Stream stream, string path)
    {
        var fullPath = Path.Combine(_basePath, path);

        Directory.CreateDirectory(Path.GetDirectoryName(fullPath)!);

        using var fileStream = File.Create(fullPath);
        await stream.CopyToAsync(fileStream);

        return fullPath;
    }

    public Task<bool> DeleteFileAsync(string path)
    {
        var fullPath = Path.Combine(_basePath, path);
        if (File.Exists(fullPath))
        {
            File.Delete(fullPath);
            return Task.FromResult(true);
        }
        else
        {
            return Task.FromResult(false);
        }
    }
}
