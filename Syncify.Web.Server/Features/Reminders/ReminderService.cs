using Microsoft.EntityFrameworkCore;
using Syncify.Web.Server.Data;
using Syncify.Web.Server.Extensions;
using Syncify.Web.Server.Features.Reminders;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;

namespace Syncify.Web.Server.Features.Reminders
{
    public interface IReminderService
    {
        Task<Response<ReminderGetDto>> CreateReminder(ReminderCreateDto dto);
        Task<List<ReminderGetDto>> GetRemindersByUserId(int userId);
        Task<Response<ReminderGetDto>> GetById(int id);
        Task<Response<ReminderGetDto>> UpdateReminder(int id, ReminderUpdateDto dto);
        Task<Response> DeleteReminder(int id);
    }

    public class ReminderService : IReminderService
    {
        private readonly DataContext _dataContext;

        public ReminderService(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public async Task<Response<ReminderGetDto>> CreateReminder(ReminderCreateDto dto)
        {
            var reminder = dto.MapTo<Reminder>();
            _dataContext.Set<Reminder>().Add(reminder);
            await _dataContext.SaveChangesAsync();

            return reminder.MapTo<ReminderGetDto>().AsResponse();
        }
        public Task<List<ReminderGetDto>> GetRemindersByUserId(int userId)
        {
            return _dataContext
                .Set<Reminder>()
                .Where(x => x.UserId == userId)
                .ProjectTo<ReminderGetDto>()
                .ToListAsync();
        }

        public async Task<Response<ReminderGetDto>> GetById(int id)
        {
            var reminder = await _dataContext.Set<Reminder>().FindAsync(id);
            if (reminder is null)
                return Error.AsResponse<ReminderGetDto>("Reminder not found", nameof(id));

            return reminder.MapTo<ReminderGetDto>().AsResponse();
        }

        public async Task<Response<ReminderGetDto>> UpdateReminder(int id, ReminderUpdateDto dto)
        {
            var reminder = await _dataContext.Set<Reminder>().FindAsync(id);
            if (reminder is null)
                return Error.AsResponse<ReminderGetDto>("Reminder not found", nameof(id));

            reminder.Title = dto.Title;
            reminder.Description = dto.Description;
            reminder.ReminderDateTime = dto.ReminderDateTime;

            await _dataContext.SaveChangesAsync();
            return reminder.MapTo<ReminderGetDto>().AsResponse();
        }
        public async Task<Response> DeleteReminder(int id)
        {
            var reminder = await _dataContext.Set<Reminder>().FindAsync(id);
            if (reminder is null)
                return Error.AsResponse("Reminder not found", nameof(id));

            _dataContext.Set<Reminder>().Remove(reminder);
            await _dataContext.SaveChangesAsync();

            return Response.Success();
        }
    }
}
