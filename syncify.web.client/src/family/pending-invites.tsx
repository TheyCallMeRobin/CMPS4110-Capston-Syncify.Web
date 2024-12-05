import { cardStyle } from '../main-page/MainPage.tsx';
import React, { useState } from 'react';
import { FaEnvelope } from 'react-icons/fa';
import { useAsync, useAsyncFn } from 'react-use';
import { FamilyInviteService } from '../api/generated/FamilyInviteService.ts';
import { toast } from 'react-toastify';
import {
  FamilyInviteGetDto,
  InviteStatus,
} from '../api/generated/index.defs.ts';
import { FaX } from 'react-icons/fa6';
import { DeleteConfirmationModal } from '../Components/delete-confirmation-modal.tsx';
import { notify } from '../hooks/use-subscription.ts';

type PendingInvitesProps = {
  familyId: number;
};

export const PendingInvites: React.FC<PendingInvitesProps> = ({ familyId }) => {
  const fetchInvites = useAsync(async () => {
    const response = await FamilyInviteService.getInvitesByFamilyId({
      familyId,
    });
    if (response.hasErrors) {
      response.errors.forEach((error) => toast.error(error.errorMessage));
      return [] as FamilyInviteGetDto[];
    }

    return response.data as FamilyInviteGetDto[];
  }, [familyId]);

  const [selectedInvite, setSelectedInvite] = useState<FamilyInviteGetDto>();
  const [confirmModal, setConfirmModal] = useState(false);

  const [, deleteInvite] = useAsyncFn(async (invite: FamilyInviteGetDto) => {
    const response = await FamilyInviteService.changeInviteStatus({
      body: {
        id: invite.id,
        status: InviteStatus.Cancelled,
      },
    });
    if (response.hasErrors) {
      response.errors.forEach((error) => toast.error(error.errorMessage));
      return;
    }

    toast.success('Invite canceled.');
    setConfirmModal(false);
    notify('family-refresh', undefined)
  });

  const closeModal = () => {
    setConfirmModal(false);
    setSelectedInvite(undefined);
  };

  const openModal = (invite: FamilyInviteGetDto) => {
    setSelectedInvite(invite);
    setConfirmModal(true);
  };

  return (
    <div className={'card mb-4 shadow dashboard-card'} style={cardStyle}>
      <div className="card-header primary-bg text-white">
        <div className={'hstack gap-3'}>
          <div className={'hstack gap-2'}>
            <div>
              <FaEnvelope />
            </div>
            <div>Pending Invites</div>
          </div>
        </div>
      </div>
      <div className={'card-body'}>
        {!fetchInvites.loading && (fetchInvites.value?.length ?? 0 > 0) ? (
          <table className={'table table-striped'}>
            <thead>
              <tr>
                <th>Sent To</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {fetchInvites.value?.map((invite) => (
                <tr key={invite.id}>
                  <td>{invite.userFullName}</td>
                  <td>
                    <FaX
                      style={{ color: 'red', cursor: 'pointer' }}
                      onClick={() => openModal(invite)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <>There are no pending invites.</>
        )}
      </div>
      {selectedInvite && (
        <DeleteConfirmationModal
          onDelete={() => deleteInvite(selectedInvite)}
          visible={confirmModal}
          headerText={'Delete Invite'}
          modalText={'Are you sure you want to delete this invite?'}
          onCancel={closeModal}
        />
      )}
    </div>
  );
};
