import { z } from 'zod';
import { CalendarEventType } from '../../api/generated/index.defs.ts';
import dayjs from 'dayjs';

export const schema = z.object({
  title: z.string().trim().min(1, { message: 'Event Title is required' }),
  description: z.string().optional().nullable(),
  startsOnDate: z
    .string()
    .transform((value) => dayjs(value).toDate())
    .or(z.date()),
  startsOnTime: z
    .string()
    .transform((value) => dayjs(value).toDate())
    .or(z.date()),
  endsOnDate: z
    .string()
    .optional()
    .nullable()
    .transform((value) => dayjs(value).toDate())
    .or(z.date()),
  endsOnTime: z
    .string()
    .optional()
    .nullable()
    .transform((value) => dayjs(value).toDate())
    .or(z.date()),

  calendarEventType: z.nativeEnum(CalendarEventType),
  recurrenceRule: z.string().optional(),
  calendarId: z.number(),
});
