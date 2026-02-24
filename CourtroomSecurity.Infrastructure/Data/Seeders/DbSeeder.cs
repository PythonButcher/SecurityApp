using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CourtroomSecurity.Domain.Entities;
using CourtroomSecurity.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace CourtroomSecurity.Infrastructure.Data.Seeders;

public static class DbSeeder
{
    public static async Task SeedAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<CourtroomDbContext>();
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<CourtroomDbContext>>();

        try
        {
            logger.LogInformation("Applying migrations...");
            await context.Database.MigrateAsync();

            if (!await context.Incidents.AnyAsync())
            {
                logger.LogInformation("Seeding initial incidents...");
                var incidents = GenerateMockIncidents();
                await context.Incidents.AddRangeAsync(incidents);
                await context.SaveChangesAsync();
                logger.LogInformation("Successfully inserted mock incidents.");
            }
            else
            {
                logger.LogInformation("Database already contains incidents. Skipping seed.");
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while seeding the database.");
            throw;
        }
    }

    private static List<Incident> GenerateMockIncidents()
    {
        return new List<Incident>
        {
            new Incident
            {
                IncidentDate = DateTime.UtcNow.AddDays(-1),
                Status = IncidentStatus.Open,
                ReporterFirstName = "John",
                ReporterLastName = "Doe",
                ReporterEmail = "jdoe@courtroom.local",
                ReporterJobTitle = "Bailiff",
                County = "Franklin",
                Division = "Criminal",
                Courthouse = "Main Justice Center",
                LocationWithinCourthouse = "Courtroom 3B",
                RelatedDocketNumber = "CR-2026-0042",
                Type = IncidentType.PhysicalAltercation,
                WeaponInvolved = false,
                ContrabandSeized = false,
                Narrative = "Two individuals began shouting match in gallery which escalated to a brief scuffle. Deputies intervened and separated parties."
            },
            new Incident
            {
                IncidentDate = DateTime.UtcNow.AddDays(-3),
                Status = IncidentStatus.UnderReview,
                ReporterFirstName = "Sarah",
                ReporterLastName = "Smith",
                ReporterEmail = "ssmith@courtroom.local",
                ReporterJobTitle = "Security Supervisor",
                County = "Franklin",
                Division = "Family",
                Courthouse = "Annex Building",
                LocationWithinCourthouse = "Main Entrance Security Checkpoint",
                Type = IncidentType.ContrabandFound,
                WeaponInvolved = true,
                WeaponType = "Pocket Knife (3 inch blade)",
                ContrabandSeized = true,
                ContrabandType = "Weapon",
                Narrative = "During routine magnetometer screening, an individual attempted to conceal a pocket knife in their shoe. Item was confiscated."
            },
            new Incident
            {
                IncidentDate = DateTime.UtcNow.AddDays(-7),
                Status = IncidentStatus.Closed,
                ReporterFirstName = "Michael",
                ReporterLastName = "Johnson",
                ReporterEmail = "mjohnson@courtroom.local",
                ReporterJobTitle = "Clerk",
                County = "Franklin",
                Division = "Civil",
                Courthouse = "Main Justice Center",
                LocationWithinCourthouse = "3rd Floor Hallway",
                Type = IncidentType.MedicalEmergency,
                WeaponInvolved = false,
                ContrabandSeized = false,
                Narrative = "Elderly witness fainted outside courtroom. EMTs were called and transported individual to general hospital."
            },
            new Incident
            {
                IncidentDate = DateTime.UtcNow.AddHours(-2),
                Status = IncidentStatus.Escalated,
                ReporterFirstName = "Hon. James",
                ReporterLastName = "Wilson",
                ReporterEmail = "jwilson@courtroom.local",
                ReporterJobTitle = "Judge",
                County = "Franklin",
                Division = "Criminal",
                Courthouse = "Main Justice Center",
                LocationWithinCourthouse = "Courtroom 1A",
                RelatedDocketNumber = "CR-2026-0158",
                SuspectFirstName = "Robert",
                SuspectLastName = "Tables",
                Type = IncidentType.VerbalThreat,
                WeaponInvolved = false,
                ContrabandSeized = false,
                Narrative = "Defendant directed profane language and verbal threats toward opposing counsel after verdict was read. Defendant was removed holding cell. Recommend additional security for sentencing phase."
            }
        };
    }
}
