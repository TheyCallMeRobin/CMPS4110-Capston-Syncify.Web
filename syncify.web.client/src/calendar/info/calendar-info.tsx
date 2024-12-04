import './calendar-info.css';

import { useUser } from '../../auth/auth-context.tsx';
import {
  CalendarCreateDto,
  CalendarWithFamilyGetDto,
} from '../../api/generated/index.defs.ts';
import { useAsyncFn, useAsyncRetry } from 'react-use';
import { CalendarsService } from '../../api/generated/CalendarsService.ts';
import { toast } from 'react-toastify';
import React, { useCallback, useEffect, useState } from 'react';
import { CalendarInfoRow } from './calendar-info-row.tsx';
import { notify, useSubscription } from '../../hooks/use-subscription.ts';
import { FaCheck, FaPlus } from 'react-icons/fa';
import { Button, Form } from 'react-bootstrap';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCalendarFilterStore } from '../calendar-filter-store.ts';
import { FaX } from 'react-icons/fa6';

const schema = z.object({
  name: z.string(),
  displayColor: z.string().optional(),
}) satisfies z.Schema<CalendarCreateDto>;

type CreateCalendarSchema = z.TypeOf<typeof schema>;

const generateLighterColor = (): string => {
  const r = Math.floor(110 + Math.random() * 110)
    .toString(16)
    .padStart(2, '0');

  const g = Math.floor(110 + Math.random() * 110)
    .toString(16)
    .padStart(2, '0');
  const b = Math.floor(110 + Math.random() * 110)
    .toString(16)
    .padStart(2, '0');
  return `#${r}${g}${b}`;
};

export const CalendarInfo: React.FC = () => {
  const user = useUser();

  const [editingCalendarId, setEditingCalendar] = useState(0);

  const fetchCalendars = useAsyncRetry(async () => {
    const response = await CalendarsService.getByUserWithFamilies({
      userId: user?.id ?? 0,
    });

    if (response.hasErrors) {
      response.errors.map((error) => toast.error(error.errorMessage));
      return [] as CalendarWithFamilyGetDto[];
    }
    return response.data as CalendarWithFamilyGetDto[];
  });

  useSubscription('calendar-filter-refresh', fetchCalendars.retry);

  const toggleEditMode = (calendarId: number) => {
    setEditingCalendar(() => calendarId);
  };

  useEffect(() => {
    if (
      user?.id &&
      !fetchCalendars.loading &&
      fetchCalendars.value === undefined
    ) {
      fetchCalendars.retry();
    }
  }, [fetchCalendars.value, fetchCalendars.loading, user?.id]);

  const addToFilter = useCalendarFilterStore(
    (state) => state.addCalendarToFilter
  );

  const [createMode, setCreateMode] = useState(false);

  const [, createCalendar] = useAsyncFn(
    async (values: CreateCalendarSchema) => {
      const response = await CalendarsService.create({ body: values });

      if (response.hasErrors) {
        response.errors.map((error) => toast.error(error.errorMessage));
        return;
      }

      toast.success('Calendar Created');
      notify('calendar-refresh', undefined);

      addToFilter(response.data!.id);

      fetchCalendars.retry();
    }
  );

  const _getRandomColor = useCallback(generateLighterColor, []);

  const { register, handleSubmit, setValue } = useForm<CalendarCreateDto>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      displayColor: _getRandomColor(),
    },
  });

  const enterCreateMode = () => {
    toggleEditMode(0);
    setValue('displayColor', _getRandomColor());
    setCreateMode(() => true);
  };

  const leaveCreateMode = () => setCreateMode(() => false);

  return (
    <>
      {fetchCalendars.value?.map((calendar) => (
        <CalendarInfoRow
          key={calendar.id}
          calendar={calendar}
          toggleEditMode={toggleEditMode}
          editMode={editingCalendarId === calendar.id}
        />
      ))}
      <div className={'mt-3'}>
        {!createMode ? (
          <button
            className={'btn btn-link m-0 p-0 link-underline-opacity-0'}
            onClick={enterCreateMode}
          >
            <div className={'hstack gap-2'}>
              <div>
                <FaPlus />
              </div>
              <div>Create Calendar</div>
            </div>
          </button>
        ) : (
          <Form onSubmit={handleSubmit(createCalendar)}>
            <div
              className={
                'd-flex flex-row align-items-end justify-content-between mb-2'
              }
            >
              <Form.Group>
                <Form.Label className="form-required" column={false}>
                  Name
                </Form.Label>
                <Form.Control size={'lg'} type={'text'} {...register('name')} />
              </Form.Group>
              <Form.Group>
                <Form.Control
                  className={'mx-3'}
                  type={'color'}
                  {...register('displayColor')}
                  size={'lg'}
                />
              </Form.Group>
              <div className={'ms-auto justify-content-evenly'}>
                <Button
                  variant={'outline-secondary'}
                  type={'button'}
                  onClick={leaveCreateMode}
                >
                  <FaX />
                </Button>
                <Button type={'submit'} variant={'outline-success mx-3'}>
                  <FaCheck />
                </Button>
              </div>
            </div>
          </Form>
        )}
      </div>
    </>
  );
};
