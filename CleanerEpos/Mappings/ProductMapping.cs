using AutoMapper;
using CleanerEpos.Entities;
using CleanerEpos.Models;

namespace CleanerEpos.Mappings;

public class ProductMapping : Profile
{
    public ProductMapping()
    {
        // Entity ➜ DTO
        CreateMap<Product, ProductModel>()
            .ForMember(dest => dest.CategoryName,
                opt => opt.MapFrom(src => src.Category != null ? src.Category.Name : null));

        // DTO ➜ Entity
        CreateMap<ProductModel, Product>()
            .ForMember(dest => dest.Category, opt => opt.Ignore())
            .ForMember(dest => dest.ButtonText, opt => opt.Ignore())
            .ForMember(dest => dest.SortOrder, opt => opt.Ignore())
            .ForMember(dest => dest.Created, opt => opt.Ignore())
            .ForMember(dest => dest.Modified, opt => opt.Ignore());
    }
}