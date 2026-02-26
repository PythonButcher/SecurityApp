using CourtroomSecurity.Api.Services;
using CourtroomSecurity.Application.Interfaces;
using CourtroomSecurity.Domain.Interfaces;
using CourtroomSecurity.Infrastructure.Data;
using CourtroomSecurity.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure Dependency Injection
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<CourtroomDbContext>(options =>
    options.UseNpgsql(connectionString));

// Register Repositories & Services
builder.Services.AddScoped<IIncidentRepository, IncidentRepository>();
builder.Services.AddScoped<IAttachmentRepository, AttachmentRepository>();
builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();

// Configure CORS for local React Vite dev server
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173", "http://localhost:5174")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    
    // Auto-migrate and Seed the database on startup during development
    await CourtroomSecurity.Infrastructure.Data.Seeders.DbSeeder.SeedAsync(app.Services);
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthorization();
app.MapControllers();

app.Run();
