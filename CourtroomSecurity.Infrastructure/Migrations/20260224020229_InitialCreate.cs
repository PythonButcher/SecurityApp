using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CourtroomSecurity.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AuditLogs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TableName = table.Column<string>(type: "text", nullable: false),
                    PrimaryKey = table.Column<string>(type: "text", nullable: false),
                    Action = table.Column<string>(type: "text", nullable: false),
                    OldValues = table.Column<string>(type: "jsonb", nullable: true),
                    NewValues = table.Column<string>(type: "jsonb", nullable: true),
                    Timestamp = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UserId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AuditLogs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Incidents",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    IncidentDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ReportDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    LastUpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ReporterFirstName = table.Column<string>(type: "text", nullable: false),
                    ReporterLastName = table.Column<string>(type: "text", nullable: false),
                    ReporterEmail = table.Column<string>(type: "text", nullable: false),
                    ReporterJobTitle = table.Column<string>(type: "text", nullable: false),
                    ReporterEmployeeId = table.Column<string>(type: "text", nullable: true),
                    County = table.Column<string>(type: "text", nullable: false),
                    Division = table.Column<string>(type: "text", nullable: false),
                    Courthouse = table.Column<string>(type: "text", nullable: false),
                    LocationWithinCourthouse = table.Column<string>(type: "text", nullable: false),
                    RelatedDocketNumber = table.Column<string>(type: "text", nullable: true),
                    CaseName = table.Column<string>(type: "text", nullable: true),
                    SuspectFirstName = table.Column<string>(type: "text", nullable: true),
                    SuspectLastName = table.Column<string>(type: "text", nullable: true),
                    AdditionalIdentifiers = table.Column<string>(type: "text", nullable: true),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    WeaponInvolved = table.Column<bool>(type: "boolean", nullable: false),
                    WeaponType = table.Column<string>(type: "text", nullable: true),
                    ContrabandSeized = table.Column<bool>(type: "boolean", nullable: false),
                    ContrabandType = table.Column<string>(type: "text", nullable: true),
                    Narrative = table.Column<string>(type: "text", nullable: false),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Incidents", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Attachments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    IncidentId = table.Column<Guid>(type: "uuid", nullable: false),
                    FileName = table.Column<string>(type: "text", nullable: false),
                    ContentType = table.Column<string>(type: "text", nullable: false),
                    SizeInBytes = table.Column<long>(type: "bigint", nullable: false),
                    StoragePath = table.Column<string>(type: "text", nullable: false),
                    UploadedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UploadedBy = table.Column<string>(type: "text", nullable: false),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Attachments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Attachments_Incidents_IncidentId",
                        column: x => x.IncidentId,
                        principalTable: "Incidents",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Attachments_IncidentId",
                table: "Attachments",
                column: "IncidentId");

            migrationBuilder.CreateIndex(
                name: "IX_AuditLogs_TableName",
                table: "AuditLogs",
                column: "TableName");

            migrationBuilder.CreateIndex(
                name: "IX_Incidents_IncidentDate",
                table: "Incidents",
                column: "IncidentDate");

            migrationBuilder.CreateIndex(
                name: "IX_Incidents_Status",
                table: "Incidents",
                column: "Status");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Attachments");

            migrationBuilder.DropTable(
                name: "AuditLogs");

            migrationBuilder.DropTable(
                name: "Incidents");
        }
    }
}
