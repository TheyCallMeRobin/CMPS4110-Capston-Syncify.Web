namespace Syncify.Web.Server.Extensions;

public static class EnumerableExtensions
{

    public static string GetLongestString(this IEnumerable<string> list)
    {
        return list.OrderByDescending(x => x.Length).FirstOrDefault(string.Empty);
    }
    
}