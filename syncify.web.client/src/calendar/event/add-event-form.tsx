import { z } from 'zod';
import { Form } from 'react-bootstrap';
import {
  CalendarEventCreateDto,
  CalendarEventGetDto,
  CalendarEventType,
  OptionDto,
} from '../../api/generated/index.defs.ts';
import { DateTimePickerComponent } from '@syncfusion/ej2-react-calendars';
import React, { useMemo } from 'react';
import { useAsync, useAsyncFn } from 'react-use';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarsService } from '../../api/generated/CalendarsService.ts';
import { useUser } from '../../auth/auth-context.tsx';
import { SchedulerRef } from '../calendar.tsx';
import { CalendarEventService } from '../../api/generated/CalendarEventService.ts';
import { toast } from 'react-toastify';
import { notify } from '../../hooks/use-subscription.ts';
import { LoadingContainer } from '../../Components/loading-container.tsx';
import { RecurrenceEditorComponent } from '@syncfusion/ej2-react-schedule';

type AddEventFormProps = {
  windowRef?: SchedulerRef;
  event: CalendarEventGetDto;
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

export const AddEventForm: React.FC<AddEventFormProps> = ({
  event,
  windowRef,
}) => {
  const user = useUser();

  const defaultValues: CalendarEventCreateDto = useMemo(
    () => ({
      startsOn: new Date(event.startsOn?.toDateString() ?? ''),
      endsOn: undefined,
      title: '',
      description: undefined,
      isCompleted: false,
      calendarEventType: CalendarEventType.Event,
      recurrenceType: '',
      calendarId: 0,
    }),
    [event.startsOn]
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<CalendarEventCreateDto>({
    defaultValues: defaultValues,
    resolver: zodResolver(schema),
  });

  const eventType = watch('calendarEventType');

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
            <div className={'col-lg-6 col-md-12'}>
              <Form.Group className={'mb-3'}>
                <Form.Label className={'form-required'} column={false}>
                  Type
                </Form.Label>
                <Form.Select {...register('calendarEventType')}>
                  <option value={CalendarEventType.Event}>Event</option>
                  <option value={CalendarEventType.Task}>Task</option>
                </Form.Select>
                {errors.calendarEventType && (
                  <p style={{ color: 'red' }}>
                    {errors.calendarEventType.message}
                  </p>
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
            {(eventType === CalendarEventType.Event || !eventType) && (
              <div className={'col-md-6'}>
                <Form.Label column={false}>Ends On</Form.Label>
                <DateTimePickerComponent {...register('endsOn')} />
                {errors.endsOn && (
                  <p style={{ color: 'red' }}>{errors.endsOn.message}</p>
                )}
              </div>
            )}
          </div>
          <div className={'row mt-3'}>
            <div className={'col-md-12'}>
              <RecurrenceEditorComponent change={handleRRuleChange} />
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
