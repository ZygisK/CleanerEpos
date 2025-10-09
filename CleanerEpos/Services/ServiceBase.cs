namespace CleanerEpos.Services;

using AutoMapper;
using CleanerEpos.Data;
using Microsoft.EntityFrameworkCore;

public abstract class ServiceBase
{
    protected IMapper mapper { get; private set; }


    protected readonly DbContextOptions<ApplicationDbContext> dbOptions;

    protected ServiceBase(IMapper mapper,
        DbContextOptions<ApplicationDbContext> dbOptions)
    {
        this.mapper = mapper;
        this.dbOptions = dbOptions;
    }
}