namespace UberEats.Application.Common;

public record UploadFile(
    string FileName,
    Stream Content,
    string ContentType,
    long Length
);