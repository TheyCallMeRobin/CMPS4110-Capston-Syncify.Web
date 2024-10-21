using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Syncify.Web.Server.Filters;

public class EnumSchemaFilter : ISchemaFilter
{
    public void Apply(OpenApiSchema schema, SchemaFilterContext context)
    {
        if (context.Type.IsEnum)
        {
            schema.Type = "string";
            schema.Enum = new List<IOpenApiAny>();

            foreach (var name in Enum.GetNames(context.Type))
            {
                schema.Enum.Add(new OpenApiString(name));
            }
        }
    }
}