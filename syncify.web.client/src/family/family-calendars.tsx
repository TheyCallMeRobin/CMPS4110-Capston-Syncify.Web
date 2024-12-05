import { FaCalendar } from 'react-icons/fa';
import React, { useState } from 'react';
import { AddFamilyCalendarModal } from './add-family-calendar-modal.tsx';
import { useAsync, useAsyncFn } from 'react-use';
import { FamilyCalendarService } from '../api/generated/FamilyCalendarService.ts';
import { FaX } from 'react-icons/fa6';
import { DeleteConfirmationModal } from '../Components/delete-confirmation-modal.tsx';
import { toast } from 'react-toastify';
import { notify } from '../hooks/use-subscription.ts';
import { FamilyMemberRole } from '../api/generated/index.defs.ts';

type FamilyCalendarsProps = {
  familyId: number;
  memberRole: FamilyMemberRole;
};

export const FamilyCalendars: React.FC<FamilyCalendarsProps> = ({
  familyId,
  memberRole,
}) => {
  const fetchCalendars = useAsync(async () => {
    const response = await FamilyCalendarService.getFamilyCalendars({
      familyId,
    });
    return response.data;
  });

  const [selectedCalendarId, setSelectedCalendarId] = useState(0);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [, removeCalendarFromFamily] = useAsyncFn(async (id: number) => {
    const response = await FamilyCalendarService.removeCalendarFromFamily({
      id,
    });
    if (response.hasErrors) {
      response.errors.map((error) => toast.error(error.errorMessage));
      return;
    }

    toast.success('Calendar removed from family.');
    closeDeleteModal();
    notify('family-refresh', undefined);
  });

  const openDeleteModal = (id: number) => {
    setSelectedCalendarId(id);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedCalendarId(0);
    setDeleteModalOpen(false);
  };

  return (
    <div className={'card'}>
      <div className="card-header primary-bg text-white">
        <div className={'hstack gap-3'}>
          <div className={'hstack gap-2'}>
            <div>
              <FaCalendar />
            </div>
            <div>Calendars</div>
          </div>
          {memberRole !== FamilyMemberRole.Member && (
            <div className={'ms-auto'}>
              <AddFamilyCalendarModal familyId={familyId} />
            </div>
          )}
        </div>
      </div>
      <div className={'card-body'}>
        {!fetchCalendars.loading && (fetchCalendars.value?.length ?? 0 > 0) ? (
          <table className={'table table-striped'}>
            <thead>
              <tr>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {fetchCalendars.value?.map((calendar) => (
                <tr key={calendar.calendarId}>
                  <td>{calendar.calendarName}</td>
                  <td>
                    {memberRole !== FamilyMemberRole.Member && (
                      <FaX
                        style={{ color: 'red', cursor: 'pointer' }}
                        onClick={() => openDeleteModal(calendar.id)}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <>There are no calendars in this family.</>
        )}
      </div>
      <DeleteConfirmationModal
        visible={deleteModalOpen}
        onDelete={() => removeCalendarFromFamily(selectedCalendarId)}
        headerText={'Remove Calendar from Family'}
        modalText={
          'Are you sure you want to remove this calendar from the family?'
        }
        onCancel={closeDeleteModal}
      />
    </div>
  );
};
