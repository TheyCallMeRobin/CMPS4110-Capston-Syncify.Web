import React, { ReactElement, useMemo } from 'react';
import {
  CalendarEventCreateDto,
  CalendarEventType,
  CalendarEventUpdateDto,
  OptionDto,
} from '../../api/generated/index.defs.ts';
import { Controller, DefaultValues, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from 'react-bootstrap';
import {
  Inject,
  RecurrenceEditorComponent,
} from '@syncfusion/ej2-react-schedule';
import { useAsync, useAsyncFn } from 'react-use';
import { CalendarsService } from '../../api/generated/CalendarsService.ts';
import { useUser } from '../../auth/auth-context.tsx';
import {
  HtmlEditor,
  QuickToolbar,
  RichTextEditorComponent,
  Toolbar,
} from '@syncfusion/ej2-react-richtexteditor';
import { toolbarSettings } from './text-editor-settings.ts';
import { EventFormProps, FormValues } from './types.ts';
import { schema } from './index.ts';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

const today = new Date();
const oneHourFromNow = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDay(),
  today.getHours() + 1,
  today.getMinutes(),
  today.getSeconds()
);

export const EventForm = <
  T extends CalendarEventCreateDto | CalendarEventUpdateDto
>(
  props: EventFormProps<T>
): ReactElement => {
  const user = useUser();
  const { onSubmit, onClose, initialValues } = props;

  const fetchCalendarOptions = useAsync(async () => {
    const response = await CalendarsService.getCalendarOptions({
      userId: user?.id ?? 0,
    });
    return response.data;
  }, [user?.id]);

  const loading = fetchCalendarOptions.loading;

  const handleRRuleChange = (args: { value?: string }) => {
    setValue('recurrenceRule', args.value);
  };

  const firstCalendarId = useMemo(
    () => fetchCalendarOptions.value?.map((option) => option.value).at(0) ?? 0,
    [fetchCalendarOptions.value]
  );

  const defaultCalendarId = useMemo(
    () =>
      Number(initialValues?.calendarId) > 0
        ? initialValues?.calendarId
        : firstCalendarId,
    [firstCalendarId, initialValues?.calendarId]
  );

  const defaultValues: DefaultValues<FormValues> = useMemo<
    DefaultValues<FormValues>
  >(
    () => ({
      title: initialValues?.title,
      description: initialValues?.description,
      startsOnDate: initialValues?.startsOnDate ?? today,
      startsOnTime: initialValues?.startsOnTime ?? today,
      endsOnDate: initialValues?.endsOnDate ?? today,
      endsOnTime: initialValues?.endsOnTime ?? oneHourFromNow,
      calendarEventType:
        initialValues?.calendarEventType ?? CalendarEventType.Event,
      recurrenceRule: initialValues?.recurrenceRule ?? '',
      calendarId: defaultCalendarId,
    }),
    [
      defaultCalendarId,
      initialValues?.calendarEventType,
      initialValues?.description,
      initialValues?.endsOnDate,
      initialValues?.endsOnTime,
      initialValues?.recurrenceRule,
      initialValues?.startsOnDate,
      initialValues?.startsOnTime,
      initialValues?.title,
    ]
  );

  const {
    handleSubmit,
    register,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
    shouldFocusError: true,
  });

  const [, _onSubmit] = useAsyncFn(
    async (values: FormValues) => {
      if (
        values.calendarId === 0 ||
        !defaultValues.calendarId ||
        defaultValues.calendarId <= 0
      ) {
        values.calendarId = Number(defaultCalendarId);
      }

      await onSubmit(values as any as T);
    },
    [defaultCalendarId, defaultValues.calendarId, onSubmit]
  );

  const _onClose = () => {
    onClose();
  };

  const eventType = watch('calendarEventType');

  return (
    <>
      <Form onSubmit={handleSubmit(_onSubmit)} noValidate>
        <div className="grid">
          <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label className="form-required" column={false}>
                  Event Title
                </Form.Label>
                <Form.Control type="text" {...register('title')} size={'lg'} />
                {errors.title && (
                  <p style={{ color: 'red' }}>{errors.title.message}</p>
                )}
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label column={false} className="form-required">
                  Calendar
                </Form.Label>
                <Form.Select
                  {...register('calendarId', { valueAsNumber: true })}
                >
                  {fetchCalendarOptions.value?.map((option: OptionDto) => {
                    return (
                      <option key={option.value} value={option?.value}>
                        {option.label}
                      </option>
                    );
                  })}
                </Form.Select>
                {errors.calendarId && (
                  <p style={{ color: 'red' }}>{errors.calendarId.message}</p>
                )}
              </Form.Group>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6 col-md-12">
              <Form.Group className="mb-3">
                <Form.Label className="form-required" column={false}>
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
          <div className="row">
            <div className="col-md-12">
              <Form.Group className="mb-3">
                <Form.Label column={false}>Description</Form.Label>
                <RichTextEditorComponent toolbarSettings={toolbarSettings}>
                  <Inject services={[Toolbar, HtmlEditor, QuickToolbar]} />
                </RichTextEditorComponent>
                {errors.description && (
                  <p style={{ color: 'red' }}>{errors.description.message}</p>
                )}
              </Form.Group>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <Form.Label className="form-required" column={false}>
                Starts On
              </Form.Label>
              <div className="d-flex gap-2">
                <div>
                  <Controller
                    name="startsOnDate"
                    control={control}
                    defaultValue={defaultValues.endsOnDate}
                    render={({
                      field: { onChange, value, name, ...field },
                    }) => (
                      <DatePicker
                        {...field}
                        slotProps={{ textField: { size: 'small' } }}
                        onChange={(value) =>
                          onChange(new Date(value?.toString() ?? ''))
                        }
                        value={value ? dayjs(value) : value}
                        name={name}
                        defaultValue={value ? dayjs(value) : value}
                      />
                    )}
                  />
                  {errors.startsOnDate && (
                    <p style={{ color: 'red' }}>
                      {errors.startsOnDate?.message}
                    </p>
                  )}
                </div>
                <div>
                  <Controller
                    name="startsOnTime"
                    control={control}
                    defaultValue={defaultValues.endsOnDate}
                    render={({
                      field: { onChange, value, name, ...field },
                    }) => (
                      <TimePicker
                        {...field}
                        slotProps={{ textField: { size: 'small' } }}
                        onChange={(value) =>
                          onChange(new Date(value?.toString() ?? ''))
                        }
                        value={value ? dayjs(value) : value}
                        name={name}
                        defaultValue={value ? dayjs(value) : value}
                      />
                    )}
                  />
                  {errors.startsOnTime && (
                    <p style={{ color: 'red' }}>
                      {errors.startsOnTime?.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
            {(eventType === CalendarEventType.Event || !eventType) && (
              <div className="col-md-6">
                <Form.Label column={false}>Ends On</Form.Label>
                <div className="d-flex gap-2">
                  <div>
                    <Controller
                      name="endsOnDate"
                      control={control}
                      defaultValue={defaultValues.endsOnDate}
                      render={({
                        field: { onChange, value, name, ...field },
                      }) => (
                        <DatePicker
                          {...field}
                          slotProps={{ textField: { size: 'small' } }}
                          onChange={(value) =>
                            onChange(new Date(value?.toString() ?? ''))
                          }
                          value={value ? dayjs(value) : value}
                          name={name}
                          defaultValue={value ? dayjs(value) : value}
                        />
                      )}
                    />
                    {errors.endsOnDate && (
                      <p style={{ color: 'red' }}>
                        {errors.endsOnDate?.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Controller
                      name="endsOnTime"
                      control={control}
                      defaultValue={defaultValues.endsOnDate}
                      render={({
                        field: { onChange, value, name, ...field },
                      }) => (
                        <TimePicker
                          {...field}
                          slotProps={{ textField: { size: 'small' } }}
                          onChange={(value) =>
                            onChange(new Date(value?.toString() ?? ''))
                          }
                          value={value ? dayjs(value) : value}
                          name={name}
                          defaultValue={value ? dayjs(value) : value}
                        />
                      )}
                    />
                    {errors.endsOnTime && (
                      <p style={{ color: 'red' }}>
                        {errors.endsOnTime?.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="row mt-3">
            <div className="col-md-12">
              <RecurrenceEditorComponent
                change={handleRRuleChange}
                cssClass={'recurrence-editor'}
              />
            </div>
          </div>
          <div className="row mt-1">
            <div className="col-md-12">
              <div className="d-flex flex-row justify-content-between">
                <button
                  type="button"
                  onClick={_onClose}
                  className="btn btn-secondary"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </Form>
    </>
  );
};
