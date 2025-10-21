using AutoMapper;
using CleanerEpos.Entities;
using Epos.Mappings;

namespace CleanerEpos.Mappings;

public static class MappingExtensions
{
    public static void AddMappings(this IMapperConfigurationExpression cfg)
    {
        cfg.AddProfile<ApplicationRoleMappings>();
        cfg.AddProfile<ApplicationUserMappings>();
        cfg.AddProfile<ProductMapping>();
        cfg.AddProfile<CategoryMapping>();
        cfg.AddProfile<OrderMapping>();
    }
}