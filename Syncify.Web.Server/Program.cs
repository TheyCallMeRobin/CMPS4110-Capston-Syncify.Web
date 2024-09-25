using System.Text.Json;
using System.Text.Json.Serialization;
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
using MapperConfiguration = Syncify.Web.Server.Configurations.MapperConfiguration;

var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

var configuration = new ConfigurationBuilder()
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json")
    .AddJsonFile($"appsettings.{environment}.json", true)
    .AddEnvironmentVariables()
    .Build();

Log.Logger = new LoggerConfiguration().ReadFrom.Configuration(configuration).CreateLogger();

try
{
    var builder = WebApplication.CreateBuilder(args);

    builder.Services.AddSerilog((services, cfg) => cfg
        .ReadFrom.Configuration(builder.Configuration)
        .ReadFrom.Services(services)
        .Enrich.FromLogContext()
        .WriteTo.Console());

    builder.Services.Configure<JsonOptions>(options =>
    {
        options.SerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.SerializerOptions.WriteIndented = true;
        options.SerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

    builder.Services.AddControllers();
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddMvc();
    
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    builder.Services.AddDbContext<DataContext>(opts => opts.UseSqlServer(connectionString));
    builder.Services.AddIdentity<User, Role>().AddEntityFrameworkStores<DataContext>();
    builder.Services.AddScoped<IShoppingListService, ShoppingListService>();

    builder.Services.AddAutoMapper(typeof(Program));
    builder.Services.AddSingleton<MapperProvider>();

    ServiceConfigurations.ConfigureServices(builder.Services);
    FluentValidationConfiguration.ConfigureServices(builder.Services);
    SwaggerConfiguration.Configure(builder.Services);
    
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
        app.UseSwaggerUI();
    }

    app.UseHttpsRedirection();

    app.UseRouting();
    app.UseAuthorization();
    
    app.MapControllers();

    app.MapFallbackToFile("/index.html");

    app.Run();
}
catch (Exception exception)
{
    Log.Fatal(exception, "Application failed to start.");
}
finally
{
    await Log.CloseAndFlushAsync();
}