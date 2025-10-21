using AutoMapper;

namespace CleanerEpos.Mappings;
using CleanerEpos.Entities;
using CleanerEpos.Models;

public class OrderMapping : Profile
{
    public OrderMapping()
    {
        CreateMap<Order, OrderModel>().ReverseMap();
        CreateMap<OrderItem, OrderItemModel>().ReverseMap();
    }
}