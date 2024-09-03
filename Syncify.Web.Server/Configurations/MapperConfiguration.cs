using Syncify.Web.Server.Extensions;

namespace Syncify.Web.Server.Configurations;

public class MapperConfiguration
{
    public static void ConfigureMapper(IServiceProvider services)
    {
        var mapperProvider = services.GetRequiredService<MapperProvider>();
        MapperProvider.ServiceProvider = services;
        var mapper = mapperProvider.GetMapper();
        MappingExtensions.Mapper = mapper;
    }
}