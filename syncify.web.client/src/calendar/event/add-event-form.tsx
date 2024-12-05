import {
  CalendarEventCreateDto,
  CalendarEventGetDto,
} from '../../api/generated/index.defs.ts';
import React from 'react';
import { useAsyncFn } from 'react-use';
import { SchedulerRef } from '../calendar.tsx';
import { CalendarEventService } from '../../api/generated/CalendarEventService.ts';
import { toast } from 'react-toastify';
import { notify } from '../../hooks/use-subscription.ts';
import { LoadingContainer } from '../../Components/loading-container.tsx';
import { EventForm } from './event-form.tsx';

type AddEventFormProps = {
  windowRef?: SchedulerRef;
  event: CalendarEventGetDto;
};

export const AddEventForm: React.FC<AddEventFormProps> = ({
  event,
  windowRef,
}) => {
  const handleClose = () => {
    if (windowRef?.current) {
      windowRef.current.closeEditor();
    }
  };

  const [submitState, onSubmit] = useAsyncFn(
    async (values: CalendarEventCreateDto) => {
      const response = await CalendarEventService.createCalendarEvent({
        body: values,
      });

      if (response.hasErrors) {
        response.errors.map((error) => toast.error(error.errorMessage));
        return;
      }

      toast.success('Event created.');
      notify('calendar-refresh', undefined);
      handleClose();
    }
  );

  const loading = submitState.loading;

  return (
    <LoadingContainer loading={loading}>
      <EventForm
        onSubmit={onSubmit}
        onClose={handleClose}
        initialValues={event}
      />
    </LoadingContainer>
  );
};
