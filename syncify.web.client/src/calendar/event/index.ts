import { z } from 'zod';
import { CalendarEventType } from '../../api/generated/index.defs.ts';

export const schema = z.object({
  title: z.string().min(2),
  description: z.string().optional().nullable(),
  startsOn: z.date(),
  endsOn: z.date().optional().nullable(),
  calendarEventType: z.nativeEnum(CalendarEventType),
  recurrenceRule: z.string().optional(),
  calendarId: z.number(),
});
