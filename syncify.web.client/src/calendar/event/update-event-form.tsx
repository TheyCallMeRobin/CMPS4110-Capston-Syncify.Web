import React, { useMemo } from 'react';
import { SchedulerRef } from '../calendar.tsx';
import { useUser } from '../../auth/auth-context.tsx';
import {
  CalendarEventCreateDto,
  CalendarEventGetDto,
  CalendarEventType,
  CalendarEventUpdateDto,
  OptionDto,
} from '../../api/generated/index.defs.ts';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAsync, useAsyncFn } from 'react-use';
import { CalendarEventService } from '../../api/generated/CalendarEventService.ts';
import { toast } from 'react-toastify';
import { notify } from '../../hooks/use-subscription.ts';
import { CalendarsService } from '../../api/generated/CalendarsService.ts';
import { LoadingContainer } from '../../Components/loading-container.tsx';
import { Form } from 'react-bootstrap';
import { DateTimePickerComponent } from '@syncfusion/ej2-react-calendars';
import { z } from 'zod';

type UpdateEventFormProps = {
  event: CalendarEventGetDto;
  windowRef?: SchedulerRef;
};

const schema = z.object({
  title: z.string().min(2),
  description: z.string().optional().nullable(),
  startsOn: z.date(),
  endsOn: z.date().optional().nullable(),
  calendarEventType: z.nativeEnum(CalendarEventType),
  recurrenceRule: z.string().optional(),
  calendarId: z.number(),
});

export const UpdateEventForm: React.FC<UpdateEventFormProps> = ({
  event,
  windowRef,
}) => {
  const user = useUser();

  const defaultValues: CalendarEventCreateDto = useMemo(
    () => ({
      title: event.title,
      description: event.description,
      startsOn: event.startsOn,
      endsOn: event.endsOn,
      calendarId: event.calendarId,
      recurrenceRule: event.recurrenceRule,
      calendarEventType: event.calendarEventType,
      isCompleted: event.isCompleted,
    }),
    [event]
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CalendarEventCreateDto>({
    defaultValues: defaultValues,
    resolver: zodResolver(schema),
  });

  const handleClose = () => {
    if (windowRef?.current) {
      windowRef.current.closeEditor();
    }
  };

  const [submitState, onSubmit] = useAsyncFn(
    async (values: CalendarEventUpdateDto) => {
      const response = await CalendarEventService.updateCalendarEvent({
        id: event.id,
        body: values,
      });

      if (response.hasErrors) {
        response.errors.map((error) => toast.error(error.errorMessage));
        return;
      }

      toast.success('Event updated.');
      notify('calendar-refresh', undefined);
      handleClose();
    }
  );

  const fetchCalendarOptions = useAsync(async () => {
    const response = await CalendarsService.getCalendarOptions({
      userId: user?.id ?? 0,
    });
    return response.data;
  }, [user?.id]);

  const loading = submitState.loading || fetchCalendarOptions.loading;

  const handleRRuleChange = (args) => {
    setValue('recurrenceRule', args.value);
  };

  return (
    <LoadingContainer loading={loading}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className={'grid'}>
          <div className={'row'}>
            <div className={'col-md-6'}>
              <Form.Group className={'mb-3'}>
                <Form.Label className={'form-required'} column={false}>
                  Event Title
                </Form.Label>
                <Form.Control
                  type="text"
                  {...register('title')}
                  isInvalid={Boolean(errors.title)}
                />
                {errors.title && (
                  <p style={{ color: 'red' }}>{errors.title.message}</p>
                )}
              </Form.Group>
            </div>
            <div className={'col-md-6'}>
              <Form.Group className={'mb-3'}>
                <Form.Label column={false} className={'form-required'}>
                  Calendar
                </Form.Label>
                <Form.Select
                  {...register('calendarId', { valueAsNumber: true })}
                >
                  {fetchCalendarOptions.value?.map((option: OptionDto) => (
                    <option key={option.value} value={option?.value}>
                      {option.label}
                    </option>
                  ))}
                </Form.Select>
                {errors.calendarId && (
                  <p style={{ color: 'red' }}>{errors.calendarId.message}</p>
                )}
              </Form.Group>
            </div>
          </div>
          <div className={'row'}>
            <div className={'col-md-12'}>
              <Form.Group className={'mb-3'}>
                <Form.Label column={false}>Description</Form.Label>
                <Form.Control as="textarea" {...register('description')} />
                {errors.description && (
                  <p style={{ color: 'red' }}>{errors.description.message}</p>
                )}
              </Form.Group>
            </div>
          </div>
          <div className={'row'}>
            <div className={'col-md-6'}>
              <Form.Label column={false} className={'form-required'}>
                Starts On
              </Form.Label>
              <DateTimePickerComponent {...register('startsOn')} />
              {errors.startsOn && (
                <p style={{ color: 'red' }}>{errors.startsOn.message}</p>
              )}
            </div>
            <div className={'col-md-6'}>
              <Form.Label column={false}>Ends On</Form.Label>
              <DateTimePickerComponent {...register('endsOn')} />
              {errors.endsOn && (
                <p style={{ color: 'red' }}>{errors.endsOn.message}</p>
              )}
            </div>
          </div>
          <div className={'row mt-4'}>
            <div className={'col-md-12'}>
              <div className={'d-flex flex-row justify-content-between'}>
                <div>
                  <button
                    type={'button'}
                    onClick={handleClose}
                    className={'btn btn-secondary'}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
                <div>
                  <button
                    type="submit"
                    className={'btn btn-primary'}
                    disabled={loading}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Form>
    </LoadingContainer>
  );
};
