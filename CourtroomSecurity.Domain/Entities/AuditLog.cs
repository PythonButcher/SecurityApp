using System;

namespace CourtroomSecurity.Domain.Entities;

public class AuditLog
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string TableName { get; set; } = string.Empty;
    public string PrimaryKey { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty; // Insert, Update, SoftDelete
    public string? OldValues { get; set; } // Stored as JSON
    public string? NewValues { get; set; } // Stored as JSON
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    public string UserId { get; set; } = string.Empty; 
}
