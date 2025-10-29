using CleanerEpos.Interfaces;
using CleanerEpos.Services;

namespace CleanerEpos.Helpers;

public static class DependencyInjectionExtensions
{
    public static IServiceCollection RegisterServices(this IServiceCollection services)
    {
        return services
            .AddTransient<IUserService, UserService>()
            .AddTransient<ITokenService, TokenService>()
            .AddTransient<ICategoryService, CategoryService>()
            .AddTransient<ITransactionService, TransactionService>()
            .AddTransient<IProductService, ProductService>()
            .AddTransient<IOrderService, OrderService>();
        // .AddTransient<ITabService, TabService>()
        // .AddTransient<ILayoutObjectsService, LayoutObjectsService>()
        // .AddTransient<IAlertService, AlertService>()
        // .AddTransient<TableService>()
        // .AddTransient<OrderService>()
        // .AddHostedService<AlertCheckWorkerService>();
    }
}