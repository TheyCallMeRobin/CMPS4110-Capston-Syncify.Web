using Microsoft.EntityFrameworkCore;
using Syncify.Common.Constants;
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
    Task<Response<CalendarGetDto>> UpdateCalendar(int id, CalendarUpdateDto dto);
    Task<Response<List<CalendarGetDto>>> GetByUserId(int userId);
    Task<Response<List<CalendarGetDto>>> GetByUserWithFamilies(int userId);
    Task<Response<List<OptionDto>>> GetCalendarOptions(int userId);
    Task<Response> DeleteCalendar(int id);
}

public class CalendarService : ICalendarService
{

    private readonly DataContext _dataContext;

    public CalendarService(DataContext dataContext)
    {
        _dataContext = dataContext;
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

        return calendar.MapTo<CalendarGetDto>().AsResponse();
    }

    public async Task<Response<List<CalendarGetDto>>> GetAllCalendars()
    {
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

    public async Task<Response<CalendarGetDto>> UpdateCalendar(int id, CalendarUpdateDto dto)
    {
        var calendar = await _dataContext.Set<Calendar>().FindAsync(id);
        if (calendar is null)
            return Error.AsResponse<CalendarGetDto>(ErrorMessages.NotFoundError, nameof(id));
        
        if (await CalendarAlreadyExists(calendar.CreatedByUserId, dto.Name))
            return Error.AsResponse<CalendarGetDto>("A calendar with this name already exists for this user",
                nameof(dto.Name));

        calendar.Name = dto.Name;
        await _dataContext.SaveChangesAsync();

        return calendar.MapTo<CalendarGetDto>().AsResponse();
    }

    public async Task<Response<List<CalendarGetDto>>> GetByUserId(int userId)
    {
        var results = await _dataContext.Set<Calendar>()
            .Where(x => x.CreatedByUserId == userId)
            .ProjectTo<CalendarGetDto>()
            .ToListAsync();

        return results.AsResponse();
    }

    public async Task<Response<List<CalendarGetDto>>> GetByUserWithFamilies(int userId)
    {
        var data = await _dataContext
            .Set<Calendar>()
            .Where(x => x.CreatedByUserId == userId ||
                        x.FamilyCalendars.Any(fc => fc.Family.FamilyMembers.Any(fm => fm.UserId == userId)))
            .ProjectTo<CalendarGetDto>()
            .ToListAsync();

        return data.AsResponse();
    }

    public async Task<Response<List<OptionDto>>> GetCalendarOptions(int userId)
    {
        var data = await _dataContext
            .Set<Calendar>()
            .Where(x => x.CreatedByUserId == userId ||
                        x.FamilyCalendars.Any(fc => fc.Family.FamilyMembers.Any(fm => fm.UserId == userId)))
            .Select(x => new OptionDto(x.Name, x.Id))
            .ToListAsync();

        return data.AsResponse();
    }

    public async Task<Response> DeleteCalendar(int id)
    {
        var calendar = await _dataContext.Set<Calendar>().FindAsync(id);
        if (calendar is null)
            return Error.AsResponse(ErrorMessages.NotFoundError, nameof(id));

        _dataContext.Set<Calendar>().Remove(calendar);
        await _dataContext.SaveChangesAsync();

        return Response.Success();
    }

    private Task<bool> CalendarAlreadyExists(int userId, string name)
        => _dataContext.Set<Calendar>()
            .AnyAsync(x => x.Name.ToLower().Equals(name.ToLower()) && 
                           x.CreatedByUserId == userId);
}