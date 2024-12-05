import React, { useCallback, useState } from 'react';
import { SchedulerRef } from '../calendar.tsx';
import {
  CalendarEventGetDto,
  CalendarEventUpdateDto,
} from '../../api/generated/index.defs.ts';
import { useAsyncFn, useToggle } from 'react-use';
import { CalendarEventService } from '../../api/generated/CalendarEventService.ts';
import { toast } from 'react-toastify';
import { notify } from '../../hooks/use-subscription.ts';
import { EventForm } from './event-form.tsx';
import { SeriesUpdateConfirmation } from './series-update.tsx';

type UpdateEventFormProps = {
  event: CalendarEventGetDto & {
    recurrenceID?: any;
    recurrenceException?: any;
  };
  windowRef?: SchedulerRef;
};

export const UpdateEventForm: React.FC<UpdateEventFormProps> = ({
  event,
  windowRef,
}) => {
  const [open, toggle] = useToggle(false);

  const handleSeriesClose = () => toggle(false);

  const handleClose = useCallback(() => {
    if (windowRef?.current) {
      windowRef.current.closeEditor();
    }
  }, [windowRef]);

  const [selectOption, setSelectOption] = useState<'Single' | 'Series'>(
    'Series'
  );
  const [formValues, setFormValues] = useState<CalendarEventUpdateDto>();
  const [hasSelected, setHasSelected] = useState(false);

  const setSingleSelect = async () => {
    toggle(false);
    setSelectOption(() => 'Single');
    setHasSelected(() => true);
    await onSubmit(formValues!);
  };

  const handleResponseSuccess = useCallback(() => {
    toast.success('Event updated.');
    notify('calendar-refresh', undefined);
    handleClose();
  }, [handleClose]);

  const handleResponseErrors = (response) => {
    response.errors.map((error: { errorMessage: string }) =>
      toast.error(error.errorMessage)
    );
  };

  const handleSingularUpdate = useCallback(
    async (values: CalendarEventUpdateDto) => {
      const response =
        await CalendarEventService.updateSingularSeriesCalendarEvent({
          id: event.id,
          body: values,
        });

      if (response.hasErrors) {
        handleResponseErrors(response);
        return;
      }

      handleResponseSuccess();
    },
    [event.id, handleResponseSuccess]
  );

  const handleSeriesUpdate = useCallback(
    async (values: CalendarEventUpdateDto) => {
      const response = await CalendarEventService.updateCalendarEvent({
        id: event.id,
        body: values,
      });
      if (response.hasErrors) {
        handleResponseErrors(response);
        return;
      }
      handleResponseSuccess();
    },
    [event.id, handleResponseSuccess]
  );

  const [, onSubmit] = useAsyncFn(
    async (values: CalendarEventUpdateDto) => {
      setFormValues(() => values);

      if (event.recurrenceRule && !hasSelected) {
        toggle(true);
        return;
      }

      if (hasSelected && selectOption === 'Single') {
        await handleSingularUpdate(values);
        return;
      }

      await handleSeriesUpdate(values);
      return;
    },
    [
      event.recurrenceRule,
      handleSeriesUpdate,
      handleSingularUpdate,
      hasSelected,
      selectOption,
      toggle,
    ]
  );

  return (
    <>
      <EventForm
        key={'stable-key'}
        onSubmit={onSubmit}
        onClose={handleClose}
        initialValues={event}
      />
      <SeriesUpdateConfirmation
        onClose={handleSeriesClose}
        onSelectSingle={setSingleSelect}
        open={open}
      />
    </>
  );
};
