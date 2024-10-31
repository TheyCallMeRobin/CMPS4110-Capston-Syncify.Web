import { create } from 'zustand';
import { CalendarGetDto } from '../api/generated/index.defs.ts';

export type CalendarFilterType = {
  calendars?: CalendarGetDto[];
  calendarIds?: number[];
};

export type CalendarFilterStore = {
  filter: CalendarFilterType;
  allCalendars: CalendarGetDto[];
};

const DEFAULT_VALUES: CalendarFilterStore = {
  filter: {
    calendars: undefined,
    calendarIds: undefined,
  },
  allCalendars: [],
};

export const useCalendarFilterStore = create<CalendarFilterStore>(() => ({
  ...DEFAULT_VALUES,
}));
