import { z } from 'zod';
import { CalendarEventCreateDto, CalendarEventGetDto, CalendarEventUpdateDto } from '../../api/generated/index.defs.ts';
import { schema } from './index.ts';

export type FormValues = z.TypeOf<typeof schema>;

export type EventFormProps<T extends CalendarEventCreateDto | CalendarEventUpdateDto> =
 {
	 onSubmit: (values: T) => any;
	 onClose: () => void;
	 initialValues?: CalendarEventGetDto;
 };

export type DateTimeField = 'startsOn' | 'endsOn';