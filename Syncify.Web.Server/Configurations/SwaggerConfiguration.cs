using Swashbuckle.AspNetCore.SwaggerGen;
using Syncify.Web.Server.Filters;

namespace Syncify.Web.Server.Configurations;

public class SwaggerConfiguration
{
    public static void Configure(IServiceCollection services)
    {
        services.AddSwaggerGen(options =>
        {
            options.CustomSchemaIds((type) => type.GetPrettyName() == "Response" ? "EmptyResponse" : type.GetPrettyName());
            options.CustomOperationIds(apiDesc => apiDesc.TryGetMethodInfo(out var methodInfo) ? methodInfo.Name : null);

            options.SupportNonNullableReferenceTypes();

            options.OperationFilter<HideParamsFilter>();
            options.SchemaFilter<RequireNonNullablePropertiesSchemaFilter>();
            options.SchemaFilter<EnumSchemaFilter>();
        });
    }
}