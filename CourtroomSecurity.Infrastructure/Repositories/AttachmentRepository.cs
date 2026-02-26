using CourtroomSecurity.Domain.Entities;
using CourtroomSecurity.Domain.Interfaces;
using CourtroomSecurity.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CourtroomSecurity.Infrastructure.Repositories;

public class AttachmentRepository : IAttachmentRepository
{
    private readonly CourtroomDbContext _context;

    public AttachmentRepository(CourtroomDbContext context)
    {
        _context = context;
    }

    public async Task<Attachment?> GetByIdAsync(Guid id)
    {
        return await _context.Attachments
            .FirstOrDefaultAsync(a => a.Id == id);
    }

    public async Task<Attachment> AddAsync(Attachment attachment)
    {
        await _context.Attachments.AddAsync(attachment);
        await _context.SaveChangesAsync();
        return attachment;
    }

    public async Task DeleteAsync(Guid id)
    {
        var attachment = await GetByIdAsync(id);
        if (attachment != null)
        {
            _context.Attachments.Remove(attachment);
            await _context.SaveChangesAsync();
        }
    }
}
