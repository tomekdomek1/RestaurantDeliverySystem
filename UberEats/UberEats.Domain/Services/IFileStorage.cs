namespace UberEats.Domain.Interfaces;

public interface IFileStorage
{
    bool IsFileValid( string contentType, long length);
    Task<string> SaveAsync(Stream fileStream, string path);
    Task<bool> DeleteFileAsync(string path);

}
