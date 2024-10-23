using System.Text.Json.Serialization;
using Microsoft.Extensions.Caching.Memory;

namespace Syncify.Web.Server.Features.Quotes;

public interface IQuoteService
{
    Task<Response<QuoteGetDto>> GetQuoteOfTheDay();
}

public class QuoteService : IQuoteService
{
    private readonly IMemoryCache _memoryCache;
    private readonly HttpClient _httpClient;

    private const string API_URL = "https://zenquotes.io/api/quotes/random";
    private const string CACHE_KEY = "QUOTEOFTHEDAY";
    
    public QuoteService(IMemoryCache memoryCache, HttpClient httpClient)
    {
        _memoryCache = memoryCache;
        _httpClient = httpClient;
    }
    
    public async Task<Response<QuoteGetDto>> GetQuoteOfTheDay()
    {
        if (_memoryCache.TryGetValue<QuoteGetDto>(CACHE_KEY, out var quote))
            return quote!.AsResponse();
        
        var response = await _httpClient.GetAsync(API_URL);
        if (!response.IsSuccessStatusCode)
            return Error.AsResponse<QuoteGetDto>("Unable to get quote of the day.");

        var responseData = await response.Content.ReadFromJsonAsync<List<QuoteGetDto>>();
        if (responseData is null)
            return Error.AsResponse<QuoteGetDto>("Unable to get quote of the day.");

        var data = responseData
            .Where(x => !string.IsNullOrWhiteSpace(x.Text))
            .OrderBy(_ => Guid.NewGuid())
            .First();

        _memoryCache.Set(CACHE_KEY, data, TimeSpan.FromHours(24));
        
        return data.AsResponse();
    }
}

public record QuoteGetDto(
    [property: JsonPropertyName("q")] string Text, 
    [property: JsonPropertyName("a")] string Author);