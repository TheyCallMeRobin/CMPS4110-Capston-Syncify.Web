import {
  Button,
  Dropdown,
  Form,
  OverlayTrigger,
  Popover,
} from 'react-bootstrap';
import { FaEllipsis, FaPencil, FaTrash, FaX } from 'react-icons/fa6';
import React, { useCallback, useState } from 'react';
import {
  CalendarUpdateDto,
  CalendarWithFamilyGetDto,
  FamilyMemberRole,
} from '../../api/generated/index.defs.ts';
import { useForm } from 'react-hook-form';
import { useAsyncFn, useLocalStorage } from 'react-use';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCalendarFilterStore } from '../calendar-filter-store.ts';
import { CalendarsService } from '../../api/generated/CalendarsService.ts';
import { toast } from 'react-toastify';
import { FaCheck, FaUsers } from 'react-icons/fa';
import { DeleteConfirmationModal } from '../../Components/delete-confirmation-modal.tsx';
import { notify } from '../../hooks/use-subscription.ts';

type CalendarInfoRowProps = {
  calendar: CalendarWithFamilyGetDto;
  toggleEditMode: (calendarId: number) => void;
  editMode?: boolean;
};

const schema = z.object({
  name: z.string().trim().min(1, { message: 'Name is required' }),
  displayColor: z.string().optional(),
}) satisfies z.Schema<CalendarUpdateDto>;

type UpdateCalendarSchema = z.infer<typeof schema>;

export const CalendarInfoRow: React.FC<CalendarInfoRowProps> = React.memo(
  ({ calendar, toggleEditMode, editMode }) => {
    const { register, handleSubmit } = useForm<UpdateCalendarSchema>({
      resolver: zodResolver(schema),
      defaultValues: {
        name: calendar.name,
        displayColor: calendar.displayColor,
      },
    });

    const [deleteConfirmationModalVisible, setDeleteConfirmationModalVisible] =
      useState(false);

    const calendarIds = useCalendarFilterStore(
      (state) => state.filter.calendarIds
    );

    const addToFilter = useCalendarFilterStore(
      (state) => state.addCalendarToFilter
    );
    const removeFromFilter = useCalendarFilterStore(
      (state) => state.removeFromFilter
    );

    const [, setCalendarIds] = useLocalStorage('calendar-ids');

    const isChecked = calendarIds?.includes(calendar.id);

    const setEditMode = useCallback(() => {
      toggleEditMode(calendar.id);
    }, [calendar.id, toggleEditMode]);

    const clearEditMode = useCallback(() => {
      toggleEditMode(0);
    }, [toggleEditMode]);

    const changeFilter = useCallback(
      (checked: boolean) => {
        if (checked) {
          addToFilter(calendar.id);
        } else {
          removeFromFilter(calendar.id);
        }

        const updatedCalendarIds =
          useCalendarFilterStore.getState().filter.calendarIds;
        setCalendarIds(updatedCalendarIds);
      },
      [addToFilter, removeFromFilter, calendar.id, setCalendarIds]
    );

    const closeDeleteModal = useCallback(
      () => setDeleteConfirmationModalVisible(false),
      []
    );

    const openDeleteConfirmation = useCallback(
      () => setDeleteConfirmationModalVisible(true),
      []
    );

    const [, onSubmit] = useAsyncFn(
      async (values: UpdateCalendarSchema) => {
        const response = await CalendarsService.update({
          id: calendar.id,
          body: values,
        });

        if (response.hasErrors) {
          response.errors.forEach((error) => toast.error(error.errorMessage));
          return;
        }

        notify('calendar-refresh', undefined);

        toast.success('Calendar updated');
        clearEditMode();
      },
      [calendar.id, clearEditMode]
    );

    const [, deleteCalendar] = useAsyncFn(async () => {
      const response = await CalendarsService.delete({ id: calendar.id });
      if (response.hasErrors) {
        response.errors.forEach((error) => toast.error(error.errorMessage));
        return;
      }
      toast.success('Calendar deleted.');
      closeDeleteModal();
    }, [calendar.id, closeDeleteModal]);

    if (editMode) {
      return (
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="d-flex flex-row align-items-end justify-content-between mb-2">
            <Form.Group>
              <Form.Label className="form-required" column={false}>
                Name
              </Form.Label>
              <Form.Control size="lg" type="text" {...register('name')} />
            </Form.Group>
            <Form.Group>
              <Form.Control
                className="mx-3"
                type="color"
                {...register('displayColor')}
                size="lg"
              />
            </Form.Group>
            <div className="ms-auto justify-content-evenly">
              <Button
                variant="outline-secondary"
                type="button"
                onClick={clearEditMode}
              >
                <FaX />
              </Button>
              <Button type="submit" variant="outline-success mx-3">
                <FaCheck />
              </Button>
            </div>
          </div>
        </Form>
      );
    }

    return (
      <>
        <div className="hstack gap-2 mb-2">
          <div>
            <input
              type="checkbox"
              className="form-check-input form-check-input-large"
              checked={isChecked}
              onChange={(event) => changeFilter(event.currentTarget.checked)}
            />
          </div>
          <div className="d-flex flex-row align-content-end gap-2">
            <span>{calendar.name}</span>
            {calendar.associatedFamilies.length > 0 && (
              <OverlayTrigger
                placement="right"
                trigger="click"
                rootClose
                overlay={
                  <Popover>
                    <Popover.Header as="h3">Families</Popover.Header>
                    <Popover.Body>
                      <div className="hstack gap-2">
                        {calendar.associatedFamilies.map((family) => (
                          <div key={family}>{family}</div>
                        ))}
                      </div>
                    </Popover.Body>
                  </Popover>
                }
              >
                <span style={{ cursor: 'pointer' }}>
                  <FaUsers />
                </span>
              </OverlayTrigger>
            )}
          </div>
          <div className="ms-auto">
            {(!calendar.currentUserRole ||
              calendar.currentUserRole === FamilyMemberRole.Owner) && (
              <Dropdown>
                <Dropdown.Toggle variant="link" size="lg">
                  <FaEllipsis />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={setEditMode}>
                    <span className="hstack gap-3 ms-auto m-1">
                      <FaPencil />
                      Edit
                    </span>
                  </Dropdown.Item>
                  <Dropdown.Item onClick={openDeleteConfirmation}>
                    <span
                      className="hstack gap-3 ms-auto m-1"
                      style={{ color: 'red' }}
                    >
                      <FaTrash />
                      Delete
                    </span>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </div>
        </div>

        <DeleteConfirmationModal
          visible={deleteConfirmationModalVisible}
          onDelete={deleteCalendar}
          onCancel={closeDeleteModal}
          headerText="Delete Calendar"
        />
      </>
    );
  }
);
