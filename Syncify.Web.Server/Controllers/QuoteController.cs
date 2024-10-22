using Microsoft.AspNetCore.Mvc;
using Syncify.Web.Server.Features.Quotes;

namespace Syncify.Web.Server.Controllers;

[ApiController]
[Route("api/quotes")]
public class QuoteController : ControllerBase
{
    private readonly IQuoteService _quoteService;

    public QuoteController(IQuoteService quoteService)
    {
        _quoteService = quoteService;
    }


    [HttpGet("quote-of-the-day")]
    public async Task<ActionResult<Response<QuoteGetDto>>> GetQuoteOfTheDay()
    {
        var data = await _quoteService.GetQuoteOfTheDay();
        return Ok(data);
    }
    
}