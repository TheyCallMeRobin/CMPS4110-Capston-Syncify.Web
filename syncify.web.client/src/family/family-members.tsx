import {
  FamilyMemberGetDto,
  FamilyMemberRole,
} from '../api/generated/index.defs.ts';
import React, { useEffect, useState } from 'react';
import { cardStyle } from '../main-page/MainPage.tsx';
import { FaEllipsis, FaPencil, FaPeopleGroup, FaTrash } from 'react-icons/fa6';
import { useAsyncFn, useAsyncRetry } from 'react-use';
import { FamilyMemberService } from '../api/generated/FamilyMemberService.ts';
import { toast } from 'react-toastify';
import { Dropdown } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import { InviteModal } from './invite-modal.tsx';
import { RoleModal } from './role-modal.tsx';
import { notify, useSubscription } from '../hooks/use-subscription.ts';
import { DeleteConfirmationModal } from '../Components/delete-confirmation-modal.tsx';

type FamilyMembersProps = {
  familyId: number;
};

export const FamilyMembers: React.FC<FamilyMembersProps> = ({ familyId }) => {
  const fetchFamilyMembers = useAsyncRetry(async () => {
    const response = await FamilyMemberService.getFamilyMembers({ familyId });

    if (response.hasErrors) {
      response.errors.forEach((error) => toast.error(error.errorMessage));
      return [] as FamilyMemberGetDto[];
    }

    return response.data as FamilyMemberGetDto[];
  }, [familyId]);

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const openInviteModal = () => setIsInviteModalOpen(() => true);
  const closeInviteModal = () => setIsInviteModalOpen(() => false);

  const [selectedFamilyMember, setSelectedFamilyMember] =
    useState<FamilyMemberGetDto>();
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  useSubscription('family-members-refresh', fetchFamilyMembers.retry);

  useEffect(() => {
    if (!fetchFamilyMembers.loading) {
      fetchFamilyMembers.retry();
    }
  }, []);

  const openEditModal = (selectedMember: FamilyMemberGetDto) => {
    setSelectedFamilyMember(() => selectedMember);
    setEditModalOpen(() => true);
  };

  const closeEditModal = () => {
    setSelectedFamilyMember(() => undefined);
    setEditModalOpen(false);
  };

  const [, removeMember] = useAsyncFn(async (member: FamilyMemberGetDto) => {
    const response = await FamilyMemberService.removeFamilyMember({
      familyMemberId: member?.id ?? 0,
    });
    if (response.hasErrors) {
      response.errors.forEach((error) => toast.error(error.errorMessage));
      return;
    }

    toast.success('Family member has been removed.');
    notify('family-members-refresh', undefined);
    closeDeleteConfirmationModal();
  });

  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);

  const openDeleteConfirmationModal = (familyMember: FamilyMemberGetDto) => {
    setSelectedFamilyMember(familyMember);
    setDeleteConfirmationModal(true);
  };

  const closeDeleteConfirmationModal = () => {
    setSelectedFamilyMember(() => undefined);
    setDeleteConfirmationModal(() => false);
  };

  return (
    <>
      <div className={'card mb-4 shadow dashboard-card'} style={cardStyle}>
        <div className="card-header primary-bg text-white">
          <div className={'hstack gap-3'}>
            <div className={'hstack gap-2'}>
              <div>
                <FaPeopleGroup />
              </div>
              <div>Members</div>
            </div>
            <div className={'ms-auto'}>
              <button
                className={
                  'btn btn-primary-transparent d-flex flex-row gap-2 align-content-center'
                }
                style={{ color: 'white' }}
                onClick={openInviteModal}
              >
                <div>
                  <FaPlus />
                </div>
                Create Invite
              </button>
            </div>
          </div>
        </div>
        <div className={'card-body'}>
          <table className={'table table-striped'}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {fetchFamilyMembers.value?.map((familyMember) => {
                return (
                  <tr key={familyMember.id}>
                    <td
                      className={'align-content-center'}
                    >{`${familyMember.userFirstName} ${familyMember.userLastName}`}</td>
                    <td className={'align-content-center'}>
                      <>{familyMember.role}</>
                    </td>
                    <td>
                      {familyMember.role !== FamilyMemberRole.Owner && (
                        <Dropdown>
                          <Dropdown.Toggle variant="link">
                            <FaEllipsis />
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item
                              onClick={() => openEditModal(familyMember)}
                            >
                              <span className="hstack gap-3 ms-auto m-1">
                                <FaPencil />
                                Edit role
                              </span>
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() =>
                                openDeleteConfirmationModal(familyMember)
                              }
                            >
                              <span
                                className="hstack gap-3 ms-auto m-1"
                                style={{ color: 'red' }}
                              >
                                <FaTrash />
                                Remove from family
                              </span>
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <InviteModal
        familyId={familyId}
        open={isInviteModalOpen}
        onClose={closeInviteModal}
      />
      {selectedFamilyMember && (
        <RoleModal
          familyMember={selectedFamilyMember}
          onClose={closeEditModal}
          open={isEditModalOpen}
        />
      )}
      {selectedFamilyMember && (
        <DeleteConfirmationModal
          visible={selectedFamilyMember && deleteConfirmationModal}
          onDelete={() => removeMember(selectedFamilyMember)}
          onCancel={closeDeleteConfirmationModal}
          headerText={'Remove Member from Family'}
          modalText={
            'Are you sure you want to remove this member from the family?'
          }
        />
      )}
    </>
  );
};
