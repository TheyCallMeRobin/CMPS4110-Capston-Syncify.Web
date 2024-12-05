import {
  FamilyMemberGetDto,
  FamilyMemberRole,
} from '../api/generated/index.defs.ts';
import React, { useState } from 'react';
import { cardStyle } from '../main-page/MainPage.tsx';
import { FaEllipsis, FaPencil, FaPeopleGroup, FaTrash } from 'react-icons/fa6';
import { useUser } from '../auth/auth-context.tsx';
import { useAsync } from 'react-use';
import { FamilyMemberService } from '../api/generated/FamilyMemberService.ts';
import { toast } from 'react-toastify';
import { Dropdown } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import { InviteModal } from './invite-modal.tsx';

type FamilyMembersProps = {
  familyId: number;
};

export const FamilyMembers: React.FC<FamilyMembersProps> = ({ familyId }) => {
  const user = useUser();

  const fetchFamilyMembers = useAsync(async () => {
    const response = await FamilyMemberService.getFamilyMembers({ familyId });

    if (response.hasErrors) {
      response.errors.forEach((error) => toast.error(error.errorMessage));
      return [] as FamilyMemberGetDto[];
    }

    return response.data as FamilyMemberGetDto[];
  });

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const openInviteModal = () => setIsInviteModalOpen(() => true);
  const closeInviteModal = () => setIsInviteModalOpen(() => false);

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
                      {familyMember.role}
                    </td>
                    <td>
                      {familyMember.role !== FamilyMemberRole.Owner && (
                        <Dropdown>
                          <Dropdown.Toggle variant="link">
                            <FaEllipsis />
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item>
                              <span className="hstack gap-3 ms-auto m-1">
                                <FaPencil />
                                Edit role
                              </span>
                            </Dropdown.Item>
                            <Dropdown.Item>
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
    </>
  );
};
