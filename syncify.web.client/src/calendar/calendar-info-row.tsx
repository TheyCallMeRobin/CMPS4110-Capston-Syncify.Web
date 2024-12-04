import { Button, Dropdown, Form } from 'react-bootstrap';
import { FaEllipsis, FaPencil, FaTrash, FaX } from 'react-icons/fa6';
import React, { useState } from 'react';
import {
  CalendarUpdateDto,
  CalendarWithFamilyGetDto,
  FamilyMemberRole,
} from '../api/generated/index.defs.ts';
import { useForm } from 'react-hook-form';
import { useAsyncFn, useLocalStorage } from 'react-use';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCalendarFilterStore } from './calendar-filter-store.ts';
import { CalendarsService } from '../api/generated/CalendarsService.ts';
import { toast } from 'react-toastify';
import { FaCheck } from 'react-icons/fa';
import { LoadingContainer } from '../Components/loading-container.tsx';
import { notify } from '../hooks/use-subscription.ts';
import { DeleteConfirmationModal } from '../Components/delete-confirmation-modal.tsx';
import { useUser } from '../auth/auth-context.tsx';

type CalendarInfoRowProps = {
  calendar: CalendarWithFamilyGetDto;
  toggleEditMode: (calendarId: number) => void;
  editMode?: boolean;
};

const schema = z.object({
  name: z.string().trim().min(0, { message: 'Name is required' }),
  displayColor: z.string().optional(),
}) satisfies z.Schema<CalendarUpdateDto>;

type UpdateCalendarSchema = z.TypeOf<typeof schema>;

export const CalendarInfoRow: React.FC<CalendarInfoRowProps> = ({
  calendar,
  toggleEditMode,
  editMode,
}) => {
  const store = useCalendarFilterStore;
  const user = useUser();

  const [, setCalendarIds] = useLocalStorage('calendar-ids');

  const { register, handleSubmit } = useForm<UpdateCalendarSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: calendar.name,
      displayColor: calendar.displayColor,
    },
  });

  const setEditMode = () => {
    toggleEditMode(calendar.id);
  };

  const cancel = () => toggleEditMode(0);

  const isChecked = store.getState().filter.calendarIds?.includes(calendar.id);

  const addToFilter = useCalendarFilterStore(
    (state) => state.addCalendarToFilter
  );

  const removeFromFilter = useCalendarFilterStore(
    (state) => state.removeFromFilter
  );

  const filter = useCalendarFilterStore((state) => state.filter);

  const changeFilter = (checked: boolean) => {
    if (checked) {
      addToFilter(calendar.id);
    } else {
      removeFromFilter(calendar.id);
    }

    setCalendarIds(filter.calendarIds);
  };

  const [submitState, onSubmit] = useAsyncFn(
    async (values: UpdateCalendarSchema) => {
      const response = await CalendarsService.update({
        id: calendar.id,
        body: values,
      });

      if (response.hasErrors) {
        response.errors.map((error) => toast.error(error.errorMessage));
      } else {
        notify('calendar-filter-refresh', undefined);
        notify('calendar-refresh', undefined);
        toast.success('Calendar updated');
        cancel();
      }
    }
  );

  const [deleteConfirmationModalVisible, setDeleteConfirmationModalVisible] =
    useState(false);

  const [, deleteCalendar] = useAsyncFn(async () => {});

  if (editMode) {
    return (
      <LoadingContainer loading={submitState.loading}>
        <Form onSubmit={handleSubmit(onSubmit)}>
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
                onClick={cancel}
              >
                <FaX />
              </Button>
              <Button type={'submit'} variant={'outline-success mx-3'}>
                <FaCheck />
              </Button>
            </div>
          </div>
        </Form>
      </LoadingContainer>
    );
  }

  return (
    <>
      <div className={'hstack gap-2 mb-2'}>
        <div>
          <input
            type={'checkbox'}
            className={'form-check-input form-check-input-large'}
            defaultChecked={isChecked}
            onChange={(event) => changeFilter(event.currentTarget.checked)}
          />
        </div>
        <div>{calendar.name}</div>
        <div className={'ms-auto'}>
          <Dropdown>
            <Dropdown.Toggle variant={'link'} size={'lg'}>
              <FaEllipsis />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={setEditMode}>
                <span className={'hstack gap-3 ms-auto m-1'}>
                  <FaPencil />
                  Edit
                </span>
              </Dropdown.Item>
              {(!calendar.currentUserRole ||
                calendar.currentUserRole === FamilyMemberRole.Owner) && (
                <Dropdown.Item>
                  <span
                    className={'hstack gap-3 ms-auto m-1'}
                    style={{ color: 'red' }}
                  >
                    <FaTrash />
                    Delete
                  </span>
                </Dropdown.Item>
              )}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      <DeleteConfirmationModal
        visible={deleteConfirmationModalVisible}
        onDelete={deleteCalendar}
        onCancel={() => setDeleteConfirmationModalVisible(false)}
        headerText={'Delete Calendar'}
      />
    </>
  );
};
