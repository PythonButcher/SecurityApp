using Microsoft.AspNetCore.Mvc;
using CourtroomSecurity.Application.Dtos;
using CourtroomSecurity.Domain.Entities;
using CourtroomSecurity.Domain.Interfaces;

namespace CourtroomSecurity.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class IncidentsController : ControllerBase
{
    private readonly IIncidentRepository _incidentRepository;

    public IncidentsController(IIncidentRepository incidentRepository)
    {
        _incidentRepository = incidentRepository;
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetIncident(Guid id)
    {
        var incident = await _incidentRepository.GetByIdAsync(id);
        if (incident == null) return NotFound();
        return Ok(incident);
    }

    [HttpPost]
    public async Task<IActionResult> CreateIncident([FromBody] CreateIncidentDto dto)
    {
        var incident = new Incident
        {
            IncidentDate = dto.IncidentDate,
            ReporterFirstName = dto.ReporterFirstName,
            ReporterLastName = dto.ReporterLastName,
            ReporterEmail = dto.ReporterEmail,
            ReporterJobTitle = dto.ReporterJobTitle,
            ReporterEmployeeId = dto.ReporterEmployeeId,
            County = dto.County,
            Division = dto.Division,
            Courthouse = dto.Courthouse,
            LocationWithinCourthouse = dto.LocationWithinCourthouse,
            RelatedDocketNumber = dto.RelatedDocketNumber,
            CaseName = dto.CaseName,
            SuspectFirstName = dto.SuspectFirstName,
            SuspectLastName = dto.SuspectLastName,
            AdditionalIdentifiers = dto.AdditionalIdentifiers,
            Type = dto.Type,
            WeaponInvolved = dto.WeaponInvolved,
            WeaponType = dto.WeaponType,
            ContrabandSeized = dto.ContrabandSeized,
            ContrabandType = dto.ContrabandType,
            Narrative = dto.Narrative
        };

        var createdIncident = await _incidentRepository.AddAsync(incident);
        
        return CreatedAtAction(nameof(GetIncident), new { id = createdIncident.Id }, createdIncident);
    }

    [HttpGet]
    public async Task<IActionResult> GetAllIncidents()
    {
        var incidents = await _incidentRepository.GetAllAsync();
        return Ok(incidents);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateIncident(Guid id, [FromBody] Incident incident)
    {
        if (id != incident.Id)
        {
            return BadRequest("Incident ID mismatch");
        }

        var existingIncident = await _incidentRepository.GetByIdAsync(id);
        if (existingIncident == null)
        {
            return NotFound();
        }

        // Ideally we would map from a DTO here instead of binding the Entity directly
        // For brevity, updating the entity properties
        existingIncident.IncidentDate = incident.IncidentDate;
        existingIncident.Status = incident.Status;
        existingIncident.Type = incident.Type;
        existingIncident.Narrative = incident.Narrative;
        // ... map other fields ...

        await _incidentRepository.UpdateAsync(existingIncident);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteIncident(Guid id)
    {
        var existingIncident = await _incidentRepository.GetByIdAsync(id);
        if (existingIncident == null)
        {
            return NotFound();
        }

        await _incidentRepository.DeleteAsync(id);
        return NoContent();
    }
}
