import { create } from 'zustand';
import { CalendarGetDto } from '../api/generated/index.defs.ts';

export type CalendarFilterType = {
  calendars: CalendarGetDto[];
  calendarIds: number[];
};

export type CalendarFilterStore = {
  filter: CalendarFilterType;
  allCalendars: CalendarGetDto[];
  addCalendarToFilter: (id: number) => void;
  removeFromFilter: (id: number) => void;
  dirty?: boolean;
  loading?: boolean;
  toggleLoading: () => void;
  setDirty: (dirty: boolean) => void;
};

export const useCalendarFilterStore = create<CalendarFilterStore>((set) => ({
  dirty: false,
  loading: false,
  filter: {
    calendars: [],
    calendarIds: [],
  },
  allCalendars: [],
  addCalendarToFilter: (id: number) =>
    set((state) => {
      const includesCalendarId = state.filter.calendarIds.includes(id);

      const result = {
        ...state,
        filter: {
          ...state.filter,
          calendarIds: state.filter.calendarIds.includes(id)
            ? state.filter.calendarIds
            : [...state.filter.calendarIds, id],
        },
      };

      if (includesCalendarId) result.dirty = true;

      return result;
    }),
  removeFromFilter: (id: number) =>
    set((state) => ({
      ...state,
      filter: {
        ...state.filter,
        calendarIds: state.filter.calendarIds.filter((item) => item !== id),
      },
      dirty: true,
    })),
  toggleLoading: () =>
    set((state) => ({
      ...state,
      loading: !state.loading,
    })),
  setDirty: (dirty: boolean) =>
    set((state) => ({
      ...state,
      dirty: dirty,
    })),
}));
