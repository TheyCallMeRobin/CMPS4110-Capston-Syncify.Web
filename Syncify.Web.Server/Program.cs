using MapperConfiguration = Syncify.Web.Server.Configurations.MapperConfiguration;
using Microsoft.AspNetCore.Http.Json;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Serilog;
using Syncify.Web.Server.Configurations;
using Syncify.Web.Server.Configurations.FluentValidation;
using Syncify.Web.Server.Data;
using Syncify.Web.Server.Extensions;
using Syncify.Web.Server.Features.Authorization;
using Syncify.Web.Server.Features.ShoppingLists;
using Syncify.Web.Server.Middlewares;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.OpenApi.Models;

var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

var configuration = new ConfigurationBuilder()
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json")
    .AddJsonFile($"appsettings.{environment}.json", true)
    .AddEnvironmentVariables()
    .Build();

Log.Logger = new LoggerConfiguration().ReadFrom.Configuration(configuration).CreateLogger();

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSerilog((services, cfg) => cfg
    .ReadFrom.Configuration(builder.Configuration)
    .ReadFrom.Services(services)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .MinimumLevel.Override("Microsoft.EntityFrameworkCore", Serilog.Events.LogEventLevel.Information)
    .WriteTo.Console(restrictedToMinimumLevel: Serilog.Events.LogEventLevel.Verbose));

builder.Services.Configure<JsonOptions>(options =>
{
  options.SerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
  options.SerializerOptions.WriteIndented = true;
  options.SerializerOptions.Converters.Add(new JsonStringEnumConverter());
  options.SerializerOptions.IncludeFields = true;
});

builder.Services.AddControllers().AddJsonOptions(options =>
{
  options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddMvc();

builder.Services.AddSwaggerGen(c =>
{
  c.SwaggerDoc("v1", new OpenApiInfo { Title = "Syncify API", Version = "v1" });
});

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<DataContext>(opts => opts.UseSqlServer(connectionString));

builder.Services.AddScoped<IShoppingListService, ShoppingListService>();
builder.Services.AddMemoryCache();
builder.Services.AddHttpClient();
builder.Services.AddAutoMapper(typeof(Program));
builder.Services.AddSingleton<MapperProvider>();

ServiceConfigurations.ConfigureServices(builder.Services);
FluentValidationConfiguration.ConfigureServices(builder.Services);
SwaggerConfiguration.Configure(builder.Services);
AuthenticationConfiguration.ConfigureServices(builder.Services);

var app = builder.Build();

app.UseSerilogRequestLogging();
app.UseMiddleware<ErrorHandlingMiddleware>();

using (var scope = app.Services.CreateScope())
{
  var services = scope.ServiceProvider;
  MapperConfiguration.ConfigureMapper(services);
  var dataContext = services.GetRequiredService<DataContext>();
  var userManager = services.GetRequiredService<UserManager<User>>();
  var roleManager = services.GetRequiredService<RoleManager<Role>>();
  await dataContext.Database.MigrateAsync();

  if (app.Environment.IsDevelopment())
  {
    var dataSeeder = new DataSeeder(dataContext, userManager, roleManager);
    await dataSeeder.SeedData();
  }
}

app.UseDefaultFiles();
app.UseStaticFiles();

if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI(c =>
  {
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Syncify API v1");
    c.RoutePrefix = "swagger";
  });
}

app.UseHttpsRedirection();
app.UseRouting();
app.UseAuthorization();
app.MapControllers();
app.MapFallbackToFile("/index.html");
app.Run();

