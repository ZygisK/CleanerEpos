using AutoMapper;
using CleanerEpos.Entities;
using CleanerEpos.Models;

namespace CleanerEpos.Mappings;

public class TransactionMapping : Profile
{
    public TransactionMapping()
    {
        CreateMap<Transaction, TransactionModel>().ReverseMap();
        CreateMap<TransactionItem, TransactionItemModel>().ReverseMap();

        CreateMap<CreateTransactionModel, Transaction>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.TotalAmount, opt => opt.Ignore());

        CreateMap<CreateTransactionItemModel, TransactionItem>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.TransactionId, opt => opt.Ignore())
            .ForMember(dest => dest.Transaction, opt => opt.Ignore())
            .ForMember(dest => dest.Product, opt => opt.Ignore());
    }
}