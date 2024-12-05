import { FaCalendar } from 'react-icons/fa';
import React from 'react';
import { AddFamilyCalendarModal } from './add-family-calendar-modal.tsx';
import { useAsync } from 'react-use';
import { FamilyCalendarService } from '../api/generated/FamilyCalendarService.ts';

type FamilyCalendarsProps = {
  familyId: number;
};

export const FamilyCalendars: React.FC<FamilyCalendarsProps> = ({
  familyId,
}) => {
  const fetchCalendars = useAsync(async () => {
    const response = await FamilyCalendarService.getFamilyCalendars({
      familyId,
    });
    return response.data;
  });

  return (
    <div className={'card'}>
      <div className="card-header primary-bg text-white">
        <div className={'hstack gap-3'}>
          <div className={'hstack gap-2'}>
            <div>
              <FaCalendar />
            </div>
            <div>Calendars</div>
          </div>
          <div className={'ms-auto'}>
            <AddFamilyCalendarModal familyId={familyId} />
          </div>
        </div>
      </div>
      <div className={'card-body'}>
        {!fetchCalendars.loading && (fetchCalendars.value?.length ?? 0 > 0) ? (
          <table className={'table table-striped'}>
            <thead>
              <tr>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {fetchCalendars.value?.map((calendar) => (
                <tr key={calendar.calendarId}>
                  <td>{calendar.calendarName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <>There are no pending invites.</>
        )}
      </div>
    </div>
  );
};
