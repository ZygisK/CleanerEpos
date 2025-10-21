using System.Text;
using AutoMapper;
using CleanerEpos.Data;
using CleanerEpos.Entities;
using CleanerEpos.Helpers;
using CleanerEpos.Mappings;
using CleanerEpos.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddNewtonsoftJson();


builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseSqlite(builder.Configuration.GetConnectionString("EposDb"));
    // o => o.EnableRetryOnFailure(maxRetryCount: 3));
    options.EnableSensitiveDataLogging();
    options.UseLoggerFactory(EFCoreLogger.Factory);
    options.EnableDetailedErrors(true);
});

builder.Services
    .AddIdentity<ApplicationUser, ApplicationRole>(o =>
    {
        o.Password = new PasswordOptions()
        {
            RequiredLength = 4,
            RequireLowercase = false,
            RequireUppercase = false,
            RequireNonAlphanumeric = false,
            RequireDigit = false,
            RequiredUniqueChars = 0 
        };
    })
    .AddEntityFrameworkStores<ApplicationDbContext>();

// // Remove the old Identity configuration and replace with this:
// builder.Services
//     .AddIdentity<ApplicationUser, ApplicationRole>()
//     .AddEntityFrameworkStores<ApplicationDbContext>();
//
// // Add this configuration separately
// builder.Services.Configure<IdentityOptions>(options =>
// {
//     options.Password.RequireDigit = false;
//     options.Password.RequiredLength = 1;
//     options.Password.RequireNonAlphanumeric = false;
//     options.Password.RequireUppercase = false;
//     options.Password.RequireLowercase = false;
//     options.Password.RequiredUniqueChars = 0;
//     options.Password.RequireLowercase = false;
// });


// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add this after your Identity configuration
var serviceProvider = builder.Services.BuildServiceProvider();
var identityOptions = serviceProvider.GetRequiredService<IOptions<IdentityOptions>>();
var passwordOptions = identityOptions.Value.Password;

Console.WriteLine($"Password RequiredLength: {passwordOptions.RequiredLength}");
Console.WriteLine($"Password RequireDigit: {passwordOptions.RequireDigit}");
Console.WriteLine($"Password RequiredUniqueChars: {passwordOptions.RequiredUniqueChars}");


var appSettingsSection = builder.Configuration.GetSection("AppSettings");
builder.Services.Configure<AppSettings>(appSettingsSection);
var appSettings = appSettingsSection.Get<AppSettings>();

builder.Services.AddAuthentication(x =>
    {
        x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(x =>
    {
        x.RequireHttpsMetadata = false;
        x.SaveToken = true;
        x.TokenValidationParameters = new TokenValidationParameters
        {
            ValidIssuer = appSettings.JwtIssuer,
            ValidAudience = appSettings.JwtIssuer,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(appSettings.JwtKey)),
            ClockSkew = TimeSpan.Zero // remove delay of token when expire
        };
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminPolicy", policy =>
        policy.RequireClaim("EPOS_permission", "sys.admin"));

    options.AddPolicy("TouchUserPolicy", policy =>
        policy.RequireClaim("EPOS_permission", "touch.user"));
    
    options.AddPolicy("sys.admin", policy =>
        policy.RequireClaim("EPOS_permission", "sys.admin"));
});
var loggerFactory = LoggerFactory.Create(_ => { });
var mapperConfig = new MapperConfiguration(cfg =>
{
    cfg.AddMappings();
},
loggerFactory);

mapperConfig.AssertConfigurationIsValid();
builder.Services.AddSingleton<IMapper>(new Mapper(mapperConfig));

// Other services
builder.Services.RegisterServices();
builder.Services.AddSignalR();

if (builder.Environment.IsDevelopment())
{
    builder.Services.AddCors(options =>
    {
        options.AddDefaultPolicy(policy =>
        {
            policy.WithOrigins("http://localhost:4200")
                .WithOrigins("http://localhost:5010")
                .WithOrigins("http://localhost:3000")
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials(); 
        });
    });
}

builder.Services.AddSpaStaticFiles(configuration => { configuration.RootPath = "AdminApp/dist/admin-app/browser"; });


var app = builder.Build();
await app.EnsureRootAccess();

// using (var scope = app.Services.CreateScope())
// {
//     // var productService = scope.ServiceProvider.GetRequiredService<IProductService>();
//     // await productService.ResetValuesOnStartup();
// }

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseStaticFiles();
if (!builder.Environment.IsDevelopment())
{
    app.UseSpaStaticFiles();
}

app.UseHttpsRedirection();
app.UseRouting();
app.UseCors();

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// app.UseEndpoints(endpoints => { endpoints.MapHub<ProductPriceHub>("/stock-price-hub"); });

if (!builder.Environment.IsDevelopment())
{
    app.MapWhen(x => !x.Request.Path.Value.StartsWith("/api"),
        builder => { builder.UseSpa(spa => { spa.Options.SourcePath = "AdminApp"; }); });
}

app.Run();