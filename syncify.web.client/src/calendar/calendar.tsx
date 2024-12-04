import {
  Agenda,
  Day,
  EventSettingsModel,
  Inject,
  Month,
  PopupOpenEventArgs,
  QuickInfoTemplatesModel,
  ScheduleComponent,
  ViewDirective,
  ViewsDirective,
  Week,
  WorkWeek,
} from '@syncfusion/ej2-react-schedule';
import React, { useMemo, useRef } from 'react';
import { useAsync, useAsyncRetry } from 'react-use';
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
import { QuickInfoFooter, QuickInfoHeader } from './quick-info.tsx';
import { useShallow } from 'zustand/react/shallow';

const services = [Day, Week, WorkWeek, Month, Agenda];

export type SchedulerRef = React.MutableRefObject<ScheduleComponent | null>;

export const Calendar: React.FC = () => {
  const user = useUser();

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

    return response.data;
  }, [user?.id]);

  useSubscription('calendar-refresh', () => fetchCalendarEvents.retry());

  const calendarIds = useCalendarFilterStore(
    useShallow((state) => state.filter.calendarIds)
  );

  const fetchCalendarEvents = useAsyncRetry(async () => {
    const response = await CalendarEventService.getCalendarEventsFromCalendars({
      calendarsIds: calendarIds,
    });

    if (response.hasErrors) {
      response.errors.map((error: Error) => toast.error(error.errorMessage));
      return [];
    }
    return response.data as CalendarEventGetDto[];
  }, [calendarIds]);

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
        recurrenceID: { name: 'recurrenceId' },
        recurrenceException: { name: 'recurrenceException' },
      },
    }),
    [fetchCalendarEvents.value]
  );

  const scheduleObj = useRef<ScheduleComponent | null>(null);

  const isLoading = fetchCalendars.loading || fetchCalendarEvents.loading;

  const quickInfoTemplates: QuickInfoTemplatesModel = {
    header: QuickInfoHeader,
    footer: QuickInfoFooter,
  };

  const onPopupOpen = (args: PopupOpenEventArgs) => {
    if (args.type === 'Editor') {
      const dialog = (args.element as HTMLElement).closest(
        '.e-schedule-dialog'
      ) as HTMLElement;
      if (dialog) {
        dialog.style.width = '800px';
        dialog.style.height = '55%';
      }
    }
  };

  const onEventRendered = (args: {
    data: { calendarDisplayColor: any };
    element: { style: { backgroundColor: string } };
  }) => {
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
        enableAdaptiveUI={false}
        enableRecurrenceValidation
        editorFooterTemplate={() => undefined}
        quickInfoTemplates={quickInfoTemplates}
        ref={scheduleObj}
        width={'auto'}
        height={'80vh'}
        popupOpen={onPopupOpen}
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
