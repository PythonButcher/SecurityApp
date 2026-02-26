using System;

namespace CourtroomSecurity.Domain.Entities;

public class Attachment
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid IncidentId { get; set; }
    public Incident Incident { get; set; } = null!;
    
    public string FileName { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public long SizeInBytes { get; set; }
    public string StoragePath { get; set; } = string.Empty; // The identifier/location in Azure Blob Storage
    
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
    public string UploadedBy { get; set; } = string.Empty;
    
    public bool IsDeleted { get; set; }
}
