import React, { ReactElement, useMemo } from 'react';
import {
  CalendarEventCreateDto,
  CalendarEventType,
  CalendarEventUpdateDto,
  OptionDto,
} from '../../api/generated/index.defs.ts';
import { DefaultValues, useForm } from 'react-hook-form';
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
  RichTextEditorComponent,
  Toolbar,
} from '@syncfusion/ej2-react-richtexteditor';
import { toolbarSettings } from './text-editor-settings.ts';
import { DateTimeField, EventFormProps, FormValues } from './types.ts';
import { schema } from './index.ts';

type UpdateDateFunc = (date: Date) => void;

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

  const handleRRuleChange = (args: { value: string | undefined }) => {
    setValue('recurrenceRule', args.value);
  };

  const defaultValues: DefaultValues<FormValues> = useMemo<
    DefaultValues<FormValues>
  >(
    () => ({
      title: initialValues?.title ?? '',
      description: initialValues?.description ?? undefined,
      startsOn: initialValues
        ? new Date(initialValues.startsOn?.toDateString() ?? '')
        : new Date(),
      endsOn: initialValues?.endsOn
        ? new Date(initialValues.endsOn)
        : undefined,
      calendarEventType:
        initialValues?.calendarEventType ?? CalendarEventType.Event,
      recurrenceRule: initialValues?.recurrenceRule ?? '',
      calendarId:
        initialValues?.calendarId ??
        fetchCalendarOptions.value?.map((x) => x.value).at(0) ??
        0,
    }),
    [fetchCalendarOptions.value, initialValues]
  );

  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const [, _onSubmit] = useAsyncFn(
    async (values: FormValues) => {
      await onSubmit(values as T);
    },
    [onSubmit]
  );

  const _onClose = () => {
    onClose();
  };

  const eventType = watch('calendarEventType');

  function updateDateTime(fieldName: DateTimeField, update: UpdateDateFunc) {
    const selectedField: Date = getValues(fieldName) ?? new Date();
    const newValue = new Date(selectedField);

    update(newValue);

    setValue(fieldName, newValue);
  }

  function handleTimeFieldChange(timeString: string, fieldName: DateTimeField) {
    const [hours, minutes] = timeString.split(':').map(Number);

    updateDateTime(fieldName, (date) => {
      date.setHours(hours, minutes, 0, 0);
    });
  }

  function handleDateFieldChange(dateString: string, fieldName: DateTimeField) {
    const date = new Date(dateString);

    updateDateTime(fieldName, (selectedField) => {
      selectedField.setFullYear(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );
    });
  }

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
                <Form.Control
                  type="text"
                  {...register('title')}
                  isValid={!errors.title}
                />
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
                  defaultValue={fetchCalendarOptions.value
                    ?.map((x) => x.value)
                    .at(0)}
                  isValid={!errors.calendarId}
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
          <div className="row">
            <div className="col-lg-6 col-md-12">
              <Form.Group className="mb-3">
                <Form.Label className="form-required" column={false}>
                  Type
                </Form.Label>
                <Form.Select
                  {...register('calendarEventType')}
                  isValid={!errors.calendarEventType}
                >
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
                <Form.Label column={false}>Description Test</Form.Label>
                <RichTextEditorComponent toolbarSettings={toolbarSettings}>
                  <Inject services={[Toolbar, HtmlEditor]} />
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
                <Form.Control
                  type="date"
                  onChange={(e) =>
                    handleDateFieldChange(e.currentTarget.value, 'startsOn')
                  }
                  isValid={!errors.startsOn}
                />
                <Form.Control
                  type="time"
                  onChange={(e) =>
                    handleTimeFieldChange(e.currentTarget.value, 'startsOn')
                  }
                  isValid={!errors.endsOn}
                />
              </div>
              {errors.startsOn && (
                <p style={{ color: 'red' }}>{errors.startsOn.message}</p>
              )}
            </div>
            {(eventType === CalendarEventType.Event || !eventType) && (
              <div className="col-md-6">
                <Form.Label column={false}>Ends On</Form.Label>
                <div className="d-flex gap-2">
                  <Form.Control
                    type="date"
                    onChange={(e) =>
                      handleDateFieldChange(e.currentTarget.value, 'endsOn')
                    }
                    isValid={!errors.endsOn}
                  />
                  <Form.Control
                    type="time"
                    onChange={(e) =>
                      handleTimeFieldChange(e.currentTarget.value, 'endsOn')
                    }
                    isValid={!errors.endsOn}
                  />
                </div>
                {errors.endsOn && (
                  <p style={{ color: 'red' }}>{errors.endsOn.message}</p>
                )}
              </div>
            )}
          </div>
          <div className="row mt-3">
            <div className="col-md-12">
              <RecurrenceEditorComponent change={handleRRuleChange} />
            </div>
          </div>
          <div className="row mt-4">
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
