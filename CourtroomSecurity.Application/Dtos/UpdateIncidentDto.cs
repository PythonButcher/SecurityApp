using System;
using CourtroomSecurity.Domain.Enums;

namespace CourtroomSecurity.Application.Dtos;

public class UpdateIncidentDto
{
    public Guid Id { get; set; }
    public IncidentStatus Status { get; set; }
    
    // Allow updating type and description as part of the updater feature
    public IncidentType Type { get; set; }
    public string Narrative { get; set; } = string.Empty;
    
    // Allow updating location details
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
    public bool WeaponInvolved { get; set; }
    public string? WeaponType { get; set; }
    public bool ContrabandSeized { get; set; }
    public string? ContrabandType { get; set; }
}
