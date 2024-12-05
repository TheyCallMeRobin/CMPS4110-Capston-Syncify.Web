using Microsoft.EntityFrameworkCore;
using Syncify.Common.DataClasses;
using Syncify.Web.Server.Data;
using Syncify.Web.Server.Extensions;
using Syncify.Web.Server.Features.Calendars;
using Syncify.Web.Server.Features.Families;

namespace Syncify.Web.Server.Features.FamilyCalendars;

public interface IFamilyCalendarService
{
    Task<Response<FamilyCalendarGetDto>> GetFamilyCalendarById(int id);
    Task<Response<List<FamilyCalendarGetDto>>> GetFamilyCalendarsByFamilyId(int familyId);
    Task<Response<List<OptionDto>>> GetOptions(int userId);
    Task<Response<FamilyCalendarGetDto>> AddCalendarToFamily(FamilyCalendarCreateDto dto);
    Task<Response> RemoveCalendarFromFamily(int familyCalendarId);
}

public class FamilyCalendarService : IFamilyCalendarService
{
    private readonly DataContext _dataContext;

    public FamilyCalendarService(DataContext dataContext)
    {
        _dataContext = dataContext;
    }

    public async Task<Response<FamilyCalendarGetDto>> GetFamilyCalendarById(int id)
    {
        var familyCalendar = await _dataContext.Set<FamilyCalendar>().FirstOrDefaultAsync(x => x.Id == id);
        if (familyCalendar is null)
            return Error.AsResponse<FamilyCalendarGetDto>("Unable to find calendar for family.", nameof(id));

        return familyCalendar.MapTo<FamilyCalendarGetDto>().AsResponse();
    }

    public async Task<Response<List<FamilyCalendarGetDto>>> GetFamilyCalendarsByFamilyId(int familyId)
    {
        var calendars = await _dataContext
            .Set<FamilyCalendar>()
            .Where(x => x.FamilyId == familyId)
            .ProjectTo<FamilyCalendarGetDto>()
            .ToListAsync();

        return calendars.AsResponse();
    }

    public async Task<Response<List<OptionDto>>> GetOptions(int userId)
    {
        var data = await _dataContext
            .Set<FamilyCalendar>()
            .Where(x => x.Calendar.CreatedByUserId == userId && !x.Calendar.FamilyCalendars.Any())
            .Select(x => new OptionDto(x.Calendar.Name, x.CalendarId))
            .ToListAsync();

        return data.AsResponse();
    }

    public async Task<Response<FamilyCalendarGetDto>> AddCalendarToFamily(FamilyCalendarCreateDto dto)
    {
        var family = await _dataContext.Set<Family>().FindAsync(dto.FamilyId);
        if (family is null)
            return Error.AsResponse<FamilyCalendarGetDto>("Family not found.", nameof(dto.FamilyId));

        var calendar = await _dataContext.Set<Calendar>().FindAsync(dto.CalendarId);
        if (calendar is null)
            return Error.AsResponse<FamilyCalendarGetDto>("Calendar not found.", nameof(dto.CalendarId));

        var existingFamilyCalendar = await _dataContext
            .Set<FamilyCalendar>()
            .FirstOrDefaultAsync(x => x.FamilyId == dto.FamilyId && x.CalendarId == dto.CalendarId);

        if (existingFamilyCalendar is not null)
            return Error.AsResponse<FamilyCalendarGetDto>("This calendar is already associated with this family.",
                nameof(dto.CalendarId));

        var familyCalendar = dto.MapTo<FamilyCalendar>();

        _dataContext.Set<FamilyCalendar>().Add(familyCalendar);
        await _dataContext.SaveChangesAsync();

        return familyCalendar.MapTo<FamilyCalendarGetDto>().AsResponse();
    }

    public async Task<Response> RemoveCalendarFromFamily(int familyCalendarId)
    {
        var familyCalendar = await _dataContext.Set<FamilyCalendar>().FirstOrDefaultAsync(x => x.Id == familyCalendarId);
        if (familyCalendar is null)
            return Error.AsResponse("Family Calendar not found.", nameof(familyCalendarId));

        _dataContext.Set<FamilyCalendar>().Remove(familyCalendar);
        await _dataContext.SaveChangesAsync();

        return Response.Success();
    }
}
