using AutoMapper;
using CleanerEpos.Entities;
using CleanerEpos.Models;

namespace Epos.Mappings;

public class ApplicationRoleMappings : Profile
{
    public ApplicationRoleMappings()
    {
        CreateMap<ApplicationRoleModel, ApplicationRole>()
            .ForMember(x => x.Name, o => o.MapFrom(src => src.Name))
            .ForMember(x => x.Id, o => o.MapFrom(src => src.Id))
            .ForMember(x => x.ConcurrencyStamp, o => o.Ignore())
            .ForMember(x => x.NormalizedName, o => o.Ignore())
            .ReverseMap();
    }
}