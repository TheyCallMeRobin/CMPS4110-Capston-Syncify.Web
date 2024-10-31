import {
  Agenda,
  Day,
  EventSettingsModel,
  Inject,
  Month,
  QuickInfoTemplatesModel,
  ScheduleComponent,
  ViewDirective,
  ViewsDirective,
  Week,
  WorkWeek,
} from '@syncfusion/ej2-react-schedule';
import React, { useMemo, useRef, useState } from 'react';
import { useAsync, useAsyncRetry, useEffectOnce } from 'react-use';
import { useUser } from '../auth/auth-context.tsx';
import { CalendarsService } from '../api/generated/CalendarsService.ts';
import { toast } from 'react-toastify';
import { LoadingContainer } from '../Components/loading-container.tsx';
import {
  CalendarEventGetDto,
  CalendarGetDto,
  Error,
} from '../api/generated/index.defs.ts';
import { CalendarEventService } from '../api/generated/CalendarEventService.ts';
import { useCalendarFilterStore } from './calendar-filter-store.ts';
import { useSubscription } from '../hooks/use-subscription.ts';
import { CalendarEventWindow } from './event/event-window.tsx';
import { QuickInfoFooter } from './quick-info.tsx';

const services = [Day, Week, WorkWeek, Month, Agenda];

export type SchedulerRef = React.MutableRefObject<ScheduleComponent | null>;

export const Calendar: React.FC = () => {
  const user = useUser();

  const [allCalendars, setAllCalendars] = useState<CalendarGetDto[]>();

  const fetchCalendars = useAsync(async () => {
    const response = await CalendarsService.getByUserWithFamilies({
      userId: user?.id ?? 0,
    });

    if (response.hasErrors) {
      response.errors.map((error: Error) => toast.error(error.errorMessage));
      return [];
    }

    useCalendarFilterStore.setState((state) => ({
      ...state,
      allCalendars: response.data as CalendarGetDto[],
    }));

    if (!useCalendarFilterStore.getState().filter.calendars) {
      useCalendarFilterStore.setState((state) => ({
        ...state,
        filter: {
          ...state.filter,
          calendars: response.data as CalendarGetDto[],
          calendarIds: (response.data as CalendarGetDto[]).map(
            (calendar) => calendar.id
          ),
        },
      }));
    }

    setAllCalendars(response.data as CalendarGetDto[]);
    return response.data;
  }, [user?.id]);

  useEffectOnce(() => {
    if (!fetchCalendars.loading && fetchCalendars.value) {
      useCalendarFilterStore.setState({
        filter: {
          calendars: fetchCalendars.value,
        },
      });
    }
  });

  useSubscription('calendar-refresh', () => fetchCalendarEvents.retry());

  const fetchCalendarEvents = useAsyncRetry(async () => {
    const store = useCalendarFilterStore.getState();
    const ids =
      store.filter.calendarIds ?? allCalendars?.map((calendar) => calendar.id);

    const response = await CalendarEventService.getCalendarEventsFromCalendars({
      calendarsIds: ids,
    });

    if (response.hasErrors) {
      response.errors.map((error: Error) => toast.error(error.errorMessage));
      return [];
    }
    return response.data as CalendarEventGetDto[];
  }, [allCalendars]);

  const eventSettings: EventSettingsModel = useMemo(
    () => ({
      dataSource: fetchCalendarEvents.value,
      fields: {
        id: 'id',
        subject: { name: 'title' },
        startTime: { name: 'startsOn' },
        endTime: { name: 'endsOn' },
        isAllDay: { name: 'isAllDay' },
        recurrenceRule: { name: 'recurrenceRule' },
      },
    }),
    [fetchCalendarEvents.value]
  );

  const scheduleObj = useRef<ScheduleComponent | null>(null);

  const isLoading = fetchCalendars.loading || fetchCalendarEvents.loading;

  const quickInfoTemplates: QuickInfoTemplatesModel = {
    footer: QuickInfoFooter,
  };

  const onEventRendered = (args) => {
    // eslint-disable-next-line no-restricted-syntax
    console.log(args);
    if (args.data.calendarDisplayColor) {
      args.element.style.backgroundColor = args.data.calendarDisplayColor;
    } else {
      args.element.style.backgroundColor = '#2196F3';
    }
  };

  return (
    <LoadingContainer loading={isLoading}>
      <ScheduleComponent
        eventSettings={eventSettings}
        selectedDate={new Date()}
        currentView="Month"
        eventRendered={onEventRendered}
        editorTemplate={(props: CalendarEventGetDto) =>
          CalendarEventWindow({ event: props, windowRef: scheduleObj })
        }
        enableAdaptiveUI
        enableRecurrenceValidation
        editorFooterTemplate={() => undefined}
        quickInfoTemplates={quickInfoTemplates}
        ref={scheduleObj}
        width={'auto'}
        height={'auto'}
      >
        <CalendarViews />
        <Inject services={services} />
      </ScheduleComponent>
    </LoadingContainer>
  );
};

const CalendarViews = () => (
  <ViewsDirective>
    <ViewDirective option="Day" />
    <ViewDirective option="Week" />
    <ViewDirective option="Month" />
    <ViewDirective option="Agenda" />
  </ViewsDirective>
);
