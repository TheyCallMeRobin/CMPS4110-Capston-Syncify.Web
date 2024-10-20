using System.Collections.Concurrent;
using System.Reflection;

namespace Syncify.Common.Extensions;

public static class TypeExtensions
{
    
    private static readonly ConcurrentDictionary<Type, string> TypeNameCache = new();

    public static string GetPrettyName(this Type type)
    {
        if (TypeNameCache.TryGetValue(type, out var name))
        {
            return name;
        }

        var prettyName = type.Name;
        if (type.GetTypeInfo().IsGenericType)
        {
            var backtick = prettyName.IndexOf('`');
            if (backtick > 0)
            {
                prettyName = prettyName.Remove(backtick);
            }
            prettyName += "<";
            var typeParameters = type.GetGenericArguments();
            for (var i = 0; i < typeParameters.Length; ++i)
            {
                var typeParamName = GetPrettyName(typeParameters[i]);
                prettyName += (i == 0 ? typeParamName : "," + typeParamName);
            }
            prettyName += ">";
        }
        else
        {
            prettyName = type.FullName?.Split('.').Reverse().First();
        }

        var typeName = prettyName?.Replace('+', '.');
        TypeNameCache?.TryAdd(type, typeName);

        return typeName;
    }
}