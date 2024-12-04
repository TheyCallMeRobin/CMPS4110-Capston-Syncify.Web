using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Syncify.Common.DataClasses;
using Syncify.Web.Server.Data;
using Syncify.Web.Server.Extensions;

namespace Syncify.Web.Server.Features.Calendars;

public interface ICalendarService
{
    Task<Response<CalendarGetDto>> GetCalendarById(int id);
    Task<Response<CalendarGetDto>> CreateCalendar(CalendarCreateDto dto);
    Task<Response<List<CalendarGetDto>>> GetAllCalendars();
    Task<Response<List<CalendarWithEventsDto>>> GetCalendarsByUserId(int userId);
    Task<Response<CalendarGetDto>> UpdateCalendar(int id, CalendarUpdateDto dto, int requestingUserId);
    Task<Response<List<CalendarGetDto>>> GetByUserId(int userId);
    Task<Response<List<CalendarWithFamilyGetDto>>> GetByUserWithFamilies(int userId);
    Task<Response<List<OptionDto>>> GetCalendarOptions(int userId);
    Task<Response> DeleteCalendar(int id, int requestingUserId);
}

public class CalendarService : ICalendarService
{

    private readonly DataContext _dataContext;
    private readonly IMemoryCache _memoryCache;

    private const string OptionsKey = "calendar-options";
    private const string CalendarsKey = "calendars";
    private const string FamilyCalendarsKey = "family-calendars";
    
    public CalendarService(DataContext dataContext, IMemoryCache memoryCache)
    {
        _dataContext = dataContext;
        _memoryCache = memoryCache;
    }

    public async Task<Response<CalendarGetDto>> GetCalendarById(int id)
    {
        var calendar = await _dataContext.Set<Calendar>().FindAsync(id);

        if (calendar is null)
            return Error.AsResponse<CalendarGetDto>(ErrorMessages.NotFoundError, nameof(id));

        return calendar.MapTo<CalendarGetDto>().AsResponse();
    }

    public async Task<Response<CalendarGetDto>> CreateCalendar(CalendarCreateDto dto)
    {
        if (await CalendarAlreadyExists(dto.CreatedByUserId, dto.Name))
            return Error.AsResponse<CalendarGetDto>("A calendar with this name already exists for this user",
                nameof(dto.Name));

        var calendar = dto.MapTo<Calendar>();

        _dataContext.Set<Calendar>().Add(calendar);
        await _dataContext.SaveChangesAsync();
        
        ClearCache(dto.CreatedByUserId);
        
        return calendar.MapTo<CalendarGetDto>().AsResponse();
    }

    public async Task<Response<List<CalendarGetDto>>> GetAllCalendars()
    {
        if (_memoryCache.TryGetValue<List<CalendarGetDto>>($"{CalendarsKey}", out var cachedData))
        {
            return cachedData!.AsResponse();
        }
        
        var data = await _dataContext.Set<Calendar>()
            .ProjectTo<CalendarGetDto>()
            .ToListAsync();

        return data.AsResponse();
    }

    public async Task<Response<List<CalendarWithEventsDto>>> GetCalendarsByUserId(int userId)
    {
        var data = await _dataContext
            .Set<Calendar>()
            .Include(x => x.CalendarEvents)
            .Where(x => x.CreatedByUserId == userId)
            .OrderBy(x => x.CalendarEvents.Max(y => y.StartsOn))
            .ProjectTo<CalendarWithEventsDto>()
            .ToListAsync();

        return data.AsResponse();
    }

    public async Task<Response<CalendarGetDto>> UpdateCalendar(int id, CalendarUpdateDto dto, int requestingUserId)
    {
        var calendar = await _dataContext.Set<Calendar>().FindAsync(id);
        if (calendar is null)
            return Error.AsResponse<CalendarGetDto>(ErrorMessages.NotFoundError, nameof(id));
        
        if (await CalendarAlreadyExists(calendar.CreatedByUserId, dto.Name, calendar.Id))
            return Error.AsResponse<CalendarGetDto>("A calendar with this name already exists for this user",
                nameof(dto.Name));

        calendar.Name = dto.Name;
        calendar.DisplayColor = dto.DisplayColor ?? "";
        
        await _dataContext.SaveChangesAsync();

        ClearCache(requestingUserId);
        
        return calendar.MapTo<CalendarGetDto>().AsResponse();
    }

    public async Task<Response<List<CalendarGetDto>>> GetByUserId(int userId)
    {
        if (_memoryCache.TryGetValue<List<CalendarGetDto>>($"{CalendarsKey}-{userId}", out var cachedData))
        {
            return cachedData!.AsResponse();
        }
        
        var results = await _dataContext.Set<Calendar>()
            .Where(x => x.CreatedByUserId == userId)
            .ProjectTo<CalendarGetDto>()
            .ToListAsync();

        _memoryCache.Set($"{CalendarsKey}-{userId}", results);
        
        return results.AsResponse();
    }

    public async Task<Response<List<CalendarWithFamilyGetDto>>> GetByUserWithFamilies(int userId)
    {
        if (_memoryCache.TryGetValue<List<CalendarWithFamilyGetDto>>($"{FamilyCalendarsKey}-{userId}", 
                out var cachedData))
        {
            return cachedData!.AsResponse();
        }
        
        var data = await _dataContext
        .Set<Calendar>()
        .Where(x => x.CreatedByUserId == userId ||
                    x.FamilyCalendars.Any(fc => fc.Family.FamilyMembers.Any(fm => fm.UserId == userId)))
        .Select(x => new CalendarWithFamilyGetDto
        {
            Id = x.Id,
            Name = x.Name,
            CreatedByUserId = x.CreatedByUserId,
            DisplayColor = x.DisplayColor,
            CurrentUserRole = x.FamilyCalendars
                .SelectMany(fc => fc.Family.FamilyMembers)
                .Where(fm => fm.UserId == userId)
                .Select(fm => fm.Role)
                .Distinct()
                .FirstOrDefault(),
            AssociatedFamilies = x.FamilyCalendars
                .Select(fc => fc.Family.Name)
                .Distinct()
                .ToList()
                    
        })
        .AsNoTracking()
        .TagWith("Get By Users With Family Calendar Included")
        .ToListAsync();

        _memoryCache.Set($"{FamilyCalendarsKey}-{userId}", data);
        
        return data.AsResponse();
    }

    public async Task<Response<List<OptionDto>>> GetCalendarOptions(int userId)
    {
        if (_memoryCache.TryGetValue<List<OptionDto>>(OptionsKey, out var cachedOptions))
        {
            return cachedOptions!.AsResponse();
        }
        
        var data = await _dataContext
            .Set<Calendar>()
            .Where(x => x.CreatedByUserId == userId ||
                        x.FamilyCalendars.Any(fc => fc.Family.FamilyMembers.Any(fm => fm.UserId == userId)))
            .Select(x => new OptionDto(x.Name, x.Id))
            .ToListAsync();

        _memoryCache.Set($"{OptionsKey}-{userId}", data, TimeSpan.FromMinutes(10));
        
        return data.AsResponse();
    }

    public async Task<Response> DeleteCalendar(int id, int requestingUserId)
    {
        var calendar = await _dataContext.Set<Calendar>().FindAsync(id);
        if (calendar is null)
            return Error.AsResponse(ErrorMessages.NotFoundError, nameof(id));

        _dataContext.Set<Calendar>().Remove(calendar);
        await _dataContext.SaveChangesAsync();

        ClearCache(requestingUserId);
        
        return Response.Success();
    }

    private Task<bool> CalendarAlreadyExists(int userId, string name)
        => _dataContext.Set<Calendar>()
            .AnyAsync(x => x.Name.ToLower().Equals(name.ToLower()) && 
                           x.CreatedByUserId == userId);
    
    private Task<bool> CalendarAlreadyExists(int userId, string name, int calendarId)
        => _dataContext.Set<Calendar>()
            .AnyAsync(x => x.Name.ToLower().Equals(name.ToLower()) && 
                           x.CreatedByUserId == userId && x.Id != calendarId);

    private void ClearCache(int? userId = null)
    {
        if (userId.HasValue)
        {
            _memoryCache.Remove($"{FamilyCalendarsKey}-{userId}");
            _memoryCache.Remove($"{CalendarsKey}-{userId}");
            _memoryCache.Remove($"{OptionsKey}-{userId}");
        }
        else
        {
            _memoryCache.Remove(FamilyCalendarsKey);
            _memoryCache.Remove(CalendarsKey);
            _memoryCache.Remove(OptionsKey);
        }
    }
}