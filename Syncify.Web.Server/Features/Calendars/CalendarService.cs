﻿using Microsoft.EntityFrameworkCore;
using Syncify.Common;
using Syncify.Common.Constants;
using Syncify.Common.Errors;
using Syncify.Common.Extensions;
using Syncify.Web.Server.Data;
using Syncify.Web.Server.Extensions;

namespace Syncify.Web.Server.Features.Calendars;

public interface ICalendarService
{
    Task<Response<CalendarGetDto>> GetCalendarById(int id);
    Task<Response<CalendarGetDto>> CreateCalendar(CalendarCreateDto dto);
    Task<Response<List<CalendarGetDto>>> GetAllCalendars();
    Task<Response<CalendarGetDto>> UpdateCalendar(int id, CalendarUpdateDto dto);
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

    public async  Task<Response<List<CalendarGetDto>>> GetAllCalendars()
    {
        var data = await _dataContext.Set<Calendar>()
            .ProjectTo<CalendarGetDto>()
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
    
    private Task<bool> CalendarAlreadyExists(int userId, string name)
        => _dataContext.Set<Calendar>()
            .AnyAsync(x => x.Name.ToLower().Equals(name.ToLower()) && 
                           x.CreatedByUserId == userId);
}