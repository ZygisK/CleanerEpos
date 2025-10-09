namespace CleanerEpos.Mappings;

using AutoMapper;
using CleanerEpos.Entities;
using CleanerEpos.Models;

public class ApplicationUserMappings : Profile
{
    public ApplicationUserMappings()
    {
        CreateMap<ApplicationUserModel, ApplicationUser>()
            .ForMember(dest => dest.Id, opt => opt.Condition(src => src.Id != Guid.Empty)) // ✅ Only map Id if it's not empty
            .ForMember(x => x.Email, o => o.MapFrom(src => src.Email))
            .ForMember(x => x.NormalizedUserName, o => o.Ignore())
            .ForMember(x => x.NormalizedEmail, o => o.Ignore())
            .ForMember(x => x.EmailConfirmed, o => o.Ignore())
            .ForMember(x => x.PasswordHash, o => o.Ignore())
            .ForMember(x => x.SecurityStamp, o => o.Ignore())
            .ForMember(x => x.ConcurrencyStamp, o => o.Ignore())
            .ForMember(x => x.PhoneNumberConfirmed, o => o.Ignore())
            .ForMember(x => x.TwoFactorEnabled, o => o.Ignore())
            .ForMember(x => x.LockoutEnd, o => o.Ignore())
            .ForMember(x => x.LockoutEnabled, o => o.Ignore())
            .ForMember(x => x.AccessFailedCount, o => o.Ignore())
            .ReverseMap()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => Guid.Parse(src.Id)));
    }
}