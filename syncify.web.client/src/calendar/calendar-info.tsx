import './calendar-info.css';

import { useUser } from '../auth/auth-context.tsx';
import { CalendarWithFamilyGetDto } from '../api/generated/index.defs.ts';
import { useAsyncRetry, useEffectOnce } from 'react-use';
import { CalendarsService } from '../api/generated/CalendarsService.ts';
import { toast } from 'react-toastify';
import React, { useState } from 'react';
import { CalendarInfoRow } from './calendar-info-row.tsx';
import { useSubscription } from '../hooks/use-subscription.ts';
import { CreateCalendar } from './create-calendar.tsx';

export const CalendarInfo: React.FC = () => {
  const user = useUser();

  const [editingCalendarId, setEditingCalendar] = useState(0);

  const fetchCalendars = useAsyncRetry(async () => {
    const response = await CalendarsService.getByUserWithFamilies({
      userId: user?.id ?? 0,
    });

    if (response.hasErrors) {
      response.errors.map((error) => toast.error(error.errorMessage));
      return [] as CalendarWithFamilyGetDto[];
    }
    return response.data as CalendarWithFamilyGetDto[];
  }, [user?.id]);

  const toggleEditMode = (calendarId: number) => {
    setEditingCalendar(() => calendarId);
  };

  useEffectOnce(() => {
    if (!fetchCalendars.loading) {
      fetchCalendars.retry();
    }
  });

  useSubscription('calendar-filter-refresh', fetchCalendars.retry);

  return (
    <>
      {fetchCalendars.value?.map((calendar) => (
        <CalendarInfoRow
          key={calendar.id}
          calendar={calendar}
          toggleEditMode={toggleEditMode}
          editMode={editingCalendarId === calendar.id}
        />
      ))}
      <CreateCalendar />
    </>
  );
};
