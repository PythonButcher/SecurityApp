using System;
using System.Threading.Tasks;
using CourtroomSecurity.Domain.Entities;

namespace CourtroomSecurity.Domain.Interfaces;

public interface IIncidentRepository
{
    Task<Incident?> GetByIdAsync(Guid id);
    Task<Incident> AddAsync(Incident incident);
    Task UpdateAsync(Incident incident);
    
    // Future expansion: Add specific Get methods for filtering/reporting
}
