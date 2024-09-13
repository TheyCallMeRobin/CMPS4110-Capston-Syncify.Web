using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Syncify.Web.Server.Filters;

public class HideParamsFilter : IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        if (operation.Parameters == null)
            return;

        var pathParams = operation.Parameters.Where(x => x.In == ParameterLocation.Path).ToList();

        operation.Parameters
            .Where(x =>
                pathParams.Any(y => string.Equals(x.Name, y.Name, StringComparison.CurrentCultureIgnoreCase))
                && x.In == ParameterLocation.Query)
            .ToList()
            .ForEach(x => operation.Parameters.Remove(x));

        var requestTypeKey = operation.RequestBody?.Content.Keys.FirstOrDefault();
        if (requestTypeKey == null)
            return;

        var key = operation.RequestBody?.Content[requestTypeKey]?.Schema.Reference?.ReferenceV2;

        if (key == null)
            return;

        var parameterName = key.Split("/").Last();
        var schema = context.SchemaRepository.Schemas[parameterName];

        pathParams.ForEach(x =>
        {
            if (schema.Properties.ContainsKey(x.Name))
            {
                schema.Properties.Remove(x.Name);
            }
        });
    }
}