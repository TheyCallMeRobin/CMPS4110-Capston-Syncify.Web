import { CalendarEventGetDto } from '../../api/generated/index.defs.ts';
import { AddEventForm } from './add-event-form.tsx';
import { UpdateEventForm } from './update-event-form.tsx';
import React from 'react';
import { SchedulerRef } from '../calendar.tsx';

type CalendarEventWindowProps = {
  event: CalendarEventGetDto;
  windowRef?: SchedulerRef;
};

export const CalendarEventWindow: React.FC<CalendarEventWindowProps> = ({
  event,
  windowRef,
}) => {
  return !event.id || event.id === 0 ? (
    <AddEventForm windowRef={windowRef} event={event} />
  ) : (
    <UpdateEventForm event={event} windowRef={windowRef} />
  );
};
