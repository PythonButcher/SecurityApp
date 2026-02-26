using System;
using CourtroomSecurity.Domain.Enums;

namespace CourtroomSecurity.Domain.Entities;

public class Incident
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public DateTime IncidentDate { get; set; }
    public DateTime ReportDate { get; set; } = DateTime.UtcNow;
    public IncidentStatus Status { get; set; } = IncidentStatus.Open;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? LastUpdatedAt { get; set; }
    
    // Reporter
    public string ReporterFirstName { get; set; } = string.Empty;
    public string ReporterLastName { get; set; } = string.Empty;
    public string ReporterEmail { get; set; } = string.Empty;
    public string ReporterJobTitle { get; set; } = string.Empty;
    public string? ReporterEmployeeId { get; set; }
    
    // Location
    public string County { get; set; } = string.Empty;
    public string Division { get; set; } = string.Empty;
    public string Courthouse { get; set; } = string.Empty;
    public string LocationWithinCourthouse { get; set; } = string.Empty;
    
    // Case
    public string? RelatedDocketNumber { get; set; }
    public string? CaseName { get; set; }
    
    // Subject/Suspect
    public string? SuspectFirstName { get; set; }
    public string? SuspectLastName { get; set; }
    public string? AdditionalIdentifiers { get; set; }
    
    // Details
    public IncidentType Type { get; set; }
    public bool WeaponInvolved { get; set; }
    public string? WeaponType { get; set; }
    public bool ContrabandSeized { get; set; }
    public string? ContrabandType { get; set; }
    
    public string Narrative { get; set; } = string.Empty;
    
    // Soft Delete
    public bool IsDeleted { get; set; }
    
    // Navigation Property
    public ICollection<Attachment> Attachments { get; set; } = new List<Attachment>();
}
