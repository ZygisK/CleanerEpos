using AutoMapper;
using CleanerEpos.Entities;
using CleanerEpos.Models;

namespace CleanerEpos.Mappings
{
    public class CategoryMapping : Profile
    {
        public CategoryMapping()
        {
            CreateMap<CategoryModel, Category>()
                .ForMember(dest => dest.Description, opt => opt.Ignore())
                .ForMember(dest => dest.BaseCategoryId, opt => opt.Ignore())
                .ForMember(dest => dest.Products, opt => opt.Ignore())
                .ForMember(dest => dest.Icon, opt => opt.Ignore())
                .ForMember(dest => dest.ButtonText, opt => opt.Ignore())
                .ForMember(dest => dest.SortOrder, opt => opt.Ignore())
                .ForMember(dest => dest.Created, opt => opt.Ignore())
                .ForMember(dest => dest.Modified, opt => opt.Ignore())
                .ReverseMap();
        }
    }
}