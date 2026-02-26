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

            logger.LogInformation("Wiping existing incidents and audit logs for a fresh mock state...");
            
            // ExecuteDeleteAsync performs a bulk physical delete directly against the database, 
            // bypassing EF Core's ChangeTracker and therefore bypassing our Soft Delete / Audit Log overrides.
            await context.AuditLogs.ExecuteDeleteAsync();
            await context.Incidents.IgnoreQueryFilters().ExecuteDeleteAsync();

            logger.LogInformation("Seeding 100 new secure randomized incidents...");
            var incidents = GenerateMockIncidents(100);
            await context.Incidents.AddRangeAsync(incidents);
            
            // This SaveChangesAsync WILL trigger the Audit Logging interceptors we wrote,
            // effectively creating 100 new Audit Logs for the "Added" action.
            await context.SaveChangesAsync();
            
            logger.LogInformation("Successfully inserted 100 mock incidents and generated corresponding Audit Logs.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while seeding the database.");
            throw;
        }
    }

    private static List<Incident> GenerateMockIncidents(int count)
    {
        // Using Bogus to generate realistic, securely faked data
        var faker = new Bogus.Faker<Incident>()
            .RuleFor(i => i.Id, f => Guid.NewGuid())
            .RuleFor(i => i.IncidentDate, f => f.Date.Past(1).ToUniversalTime())
            .RuleFor(i => i.ReportDate, (f, i) => i.IncidentDate.AddHours(f.Random.Int(1, 48)).ToUniversalTime())
            .RuleFor(i => i.Status, f => f.PickRandom<IncidentStatus>())
            .RuleFor(i => i.ReporterFirstName, f => f.Name.FirstName())
            .RuleFor(i => i.ReporterLastName, f => f.Name.LastName())
            .RuleFor(i => i.ReporterEmail, (f, i) => f.Internet.Email(i.ReporterFirstName, i.ReporterLastName))
            .RuleFor(i => i.ReporterJobTitle, f => f.Name.JobTitle())
            .RuleFor(i => i.ReporterEmployeeId, f => f.Random.Replace("EMP-####"))
            .RuleFor(i => i.County, f => f.Address.County())
            .RuleFor(i => i.Division, f => f.PickRandom("Criminal", "Civil", "Family", "Probate", "Juvenile"))
            .RuleFor(i => i.Courthouse, f => f.Address.City() + " Justice Center")
            .RuleFor(i => i.LocationWithinCourthouse, f => "Room " + f.Random.Int(100, 999))
            .RuleFor(i => i.RelatedDocketNumber, f => f.Random.Replace("CR-202#-####"))
            .RuleFor(i => i.CaseName, f => $"State vs. {f.Name.LastName()}")
            .RuleFor(i => i.SuspectFirstName, f => f.Random.Bool(0.7f) ? f.Name.FirstName() : null)
            .RuleFor(i => i.SuspectLastName, (f, i) => i.SuspectFirstName != null ? f.Name.LastName() : null)
            .RuleFor(i => i.Type, f => f.PickRandom<IncidentType>())
            .RuleFor(i => i.WeaponInvolved, f => f.Random.Bool(0.15f))
            .RuleFor(i => i.WeaponType, (f, i) => i.WeaponInvolved ? f.PickRandom("Pocket Knife", "Firearm", "Blunt Object", "Box Cutter") : null)
            .RuleFor(i => i.ContrabandSeized, f => f.Random.Bool(0.2f))
            .RuleFor(i => i.ContrabandType, (f, i) => i.ContrabandSeized ? f.PickRandom("Narcotics", "Paraphernalia", "Unauthorized Electronics") : null)
            .RuleFor(i => i.Narrative, f => f.Lorem.Paragraphs(f.Random.Int(1, 3)));

        return faker.Generate(count);
    }
}
