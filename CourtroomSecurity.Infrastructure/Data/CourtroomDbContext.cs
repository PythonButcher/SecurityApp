using System.Text.Json;
using CourtroomSecurity.Application.Interfaces;
using CourtroomSecurity.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CourtroomSecurity.Infrastructure.Data;

public class CourtroomDbContext : DbContext
{
    private readonly ICurrentUserService _currentUserService;

    public CourtroomDbContext(DbContextOptions<CourtroomDbContext> options, ICurrentUserService currentUserService) : base(options)
    {
        _currentUserService = currentUserService;
    }

    public DbSet<Incident> Incidents => Set<Incident>();
    public DbSet<Attachment> Attachments => Set<Attachment>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Global Query Filters (for Soft Delete & RBAC conceptually)
        modelBuilder.Entity<Incident>().HasQueryFilter(x => !x.IsDeleted);
        modelBuilder.Entity<Attachment>().HasQueryFilter(x => !x.IsDeleted);

        // Required explicitly for PostgreSQL Timestamp with timezone behavior
        AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
        
        // Incident configuration
        modelBuilder.Entity<Incident>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Narrative).HasColumnType("text");
            entity.HasIndex(e => e.IncidentDate);
            entity.HasIndex(e => e.Status);
        });

        // Attachment configuration
        modelBuilder.Entity<Attachment>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.Incident)
                  .WithMany(i => i.Attachments)
                  .HasForeignKey(e => e.IncidentId)
                  .OnDelete(DeleteBehavior.Restrict);
        });
        
        // AuditLog configuration
        modelBuilder.Entity<AuditLog>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.OldValues).HasColumnType("jsonb");
            entity.Property(e => e.NewValues).HasColumnType("jsonb");
            entity.HasIndex(e => e.TableName);
        });
    }

    // Override SaveChangesAsync to enforce Immutability & automatic Audit Logging
    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var entries = ChangeTracker.Entries()
            .Where(e => e.State == EntityState.Added || e.State == EntityState.Modified || e.State == EntityState.Deleted)
            .ToList();

        var userId = _currentUserService.IsAuthenticated ? _currentUserService.UserId : "System";

        foreach (var entry in entries)
        {
            // Soft delete enforcement
            if (entry.State == EntityState.Deleted)
            {
                if (entry.Entity is Incident || entry.Entity is Attachment)
                {
                    entry.State = EntityState.Modified;
                    entry.CurrentValues["IsDeleted"] = true;
                }
            }
            else if (entry.State == EntityState.Modified)
            {
                if (entry.Entity is Incident incident)
                {
                    incident.LastUpdatedAt = DateTime.UtcNow;
                }
            }

            // Create Audit Log ignoring the AuditLog table itself
            if (entry.Entity is not AuditLog)
            {
                var auditLog = new AuditLog
                {
                    TableName = entry.Metadata.GetTableName() ?? entry.Entity.GetType().Name,
                    Action = entry.State.ToString(),
                    Timestamp = DateTime.UtcNow,
                    UserId = userId
                };

                // primary key
                var primaryKey = entry.Properties.FirstOrDefault(p => p.Metadata.IsPrimaryKey());
                auditLog.PrimaryKey = primaryKey?.CurrentValue?.ToString() ?? string.Empty;

                var oldValues = new Dictionary<string, object?>();
                var newValues = new Dictionary<string, object?>();

                foreach (var property in entry.Properties)
                {
                    if (property.IsTemporary) continue; // Skip DB generated before save

                    string propertyName = property.Metadata.Name;

                    if (entry.State == EntityState.Added)
                    {
                        newValues[propertyName] = property.CurrentValue;
                    }
                    else if (entry.State == EntityState.Deleted)
                    {
                        oldValues[propertyName] = property.OriginalValue;
                    }
                    else if (entry.State == EntityState.Modified)
                    {
                        if (property.IsModified)
                        {
                            oldValues[propertyName] = property.OriginalValue;
                            newValues[propertyName] = property.CurrentValue;
                        }
                    }
                }

                auditLog.OldValues = oldValues.Count > 0 ? JsonSerializer.Serialize(oldValues) : null;
                auditLog.NewValues = newValues.Count > 0 ? JsonSerializer.Serialize(newValues) : null;

                AuditLogs.Add(auditLog); // Add the log to the context
            }
        }

        return await base.SaveChangesAsync(cancellationToken);
    }
}
