namespace Syncify.Web.Server.Common;

public class Units
{
    public const string Teaspoon = "tsp";
    public const string Tablespoon = "tbsp";
    public const string Cup = "cup";
    public const string Pint = "pint";
    public const string Quart = "quart";
    public const string Gallon = "gallon";
    public const string Milliliter = "ml";
    public const string Liter = "l";
    public const string Ounce = "oz";
    public const string Pound = "lb";
    public const string Gram = "g";
    public const string Kilogram = "kg";
    public const string Milligram = "mg";
    public const string Pinch = "pinch";
    public const string Dash = "dash";
    public const string FluidOunce = "fl oz";
    public const string Piece = "piece";
    
    public static List<string> List =>
        typeof(Units)
            .GetFields()
            .Where(x => x.GetRawConstantValue() is not null)
            .Select(x => x.GetRawConstantValue()!.ToString())
            .ToList()!;
}