﻿using System.Linq.Expressions;
using System.Reflection;
using AutoMapper;
using AutoMapper.QueryableExtensions;


namespace Syncify.Web.Server.Extensions;

public class MapperProvider
{
    public static IServiceProvider ServiceProvider { get; set; }
    public MapperConfiguration GetMapperConfiguration(params Assembly[] additionalAssemblies)
    {
        var configurationExpression = new MapperConfigurationExpression();
        configurationExpression.ConstructServicesUsing(ServiceProvider.GetService);

        configurationExpression.AddMaps(typeof(MapperProvider).GetTypeInfo().Assembly);

        foreach (var assembly in additionalAssemblies)
        {
            configurationExpression.AddMaps(assembly);
        }

        return new MapperConfiguration(configurationExpression);
    }

    public IMapper GetMapper()
    {
        var configuration = GetMapperConfiguration();
        return new Mapper(configuration);
    }
}

public static class MappingExtensions
{
    public static IMapper Mapper { get; set; }

    public static MapperConfiguration GetMapperConfiguration(params Assembly[] additionalAssemblies)
    {
        var configurationExpression = new MapperConfigurationExpression();

        configurationExpression.AddMaps(typeof(MapperProvider).GetTypeInfo().Assembly);

        foreach (var assembly in additionalAssemblies)
        {
            configurationExpression.AddMaps(assembly);
        }

        return new MapperConfiguration(configurationExpression);
    }
    
    public static TTarget MapTo<TTarget>(this object source)
    {
        return Mapper.Map<TTarget>(source);
    }
    
    public static IQueryable<TDestination> ProjectTo<TDestination>(
        this IQueryable source,
        params Expression<Func<TDestination, object>>[] membersToExpand
    ) => source.ProjectTo(MappingExtensions.Mapper.ConfigurationProvider, null, membersToExpand);
}