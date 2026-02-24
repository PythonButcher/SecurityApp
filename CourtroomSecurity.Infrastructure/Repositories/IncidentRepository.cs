using CourtroomSecurity.Domain.Entities;
using CourtroomSecurity.Domain.Interfaces;
using CourtroomSecurity.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CourtroomSecurity.Infrastructure.Repositories;

public class IncidentRepository : IIncidentRepository
{
    private readonly CourtroomDbContext _context;

    public IncidentRepository(CourtroomDbContext context)
    {
        _context = context;
    }

    public async Task<Incident?> GetByIdAsync(Guid id)
    {
        return await _context.Incidents
            .Include(i => i.Attachments)
            .FirstOrDefaultAsync(i => i.Id == id);
    }

    public async Task<IEnumerable<Incident>> GetAllAsync()
    {
        // EF Core Global Query Filter on IsDeleted automatically applies here
        return await _context.Incidents
            .OrderByDescending(i => i.IncidentDate)
            .ToListAsync();
    }

    public async Task<Incident> AddAsync(Incident incident)
    {
        await _context.Incidents.AddAsync(incident);
        await _context.SaveChangesAsync();
        return incident;
    }

    public async Task UpdateAsync(Incident incident)
    {
        _context.Incidents.Update(incident);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var incident = await GetByIdAsync(id);
        if (incident != null)
        {
            _context.Incidents.Remove(incident); // Maps to soft delete via DbContext SaveChanges override
            await _context.SaveChangesAsync();
        }
    }
}
