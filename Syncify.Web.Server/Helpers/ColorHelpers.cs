namespace Syncify.Web.Server.Helpers;

public static class ColorHelpers
{

    public static string GenerateRandomColor()
    {
        return $"#{Random.Shared.Next(0x1000000):X6}";
    }
    
}