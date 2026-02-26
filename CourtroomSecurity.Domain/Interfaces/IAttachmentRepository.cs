using System;
using System.Threading.Tasks;
using CourtroomSecurity.Domain.Entities;

namespace CourtroomSecurity.Domain.Interfaces;

public interface IAttachmentRepository
{
    Task<Attachment?> GetByIdAsync(Guid id);
    Task<Attachment> AddAsync(Attachment attachment);
    Task DeleteAsync(Guid id);
}
