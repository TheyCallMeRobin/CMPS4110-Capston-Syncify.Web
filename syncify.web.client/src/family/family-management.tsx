import React, { useEffect, useState } from 'react';
import { useAsync, useAsyncRetry } from 'react-use';
import { useUser } from '../auth/auth-context.tsx';
import { FamilyService } from '../api/generated/FamilyService.ts';
import { toast } from 'react-toastify';
import { OptionDto } from '../api/generated/index.defs.ts';
import { LoadingContainer } from '../Components/loading-container.tsx';
import { FamilyMembers } from './family-members.tsx';
import { PendingInvites } from './pending-invites.tsx';
import { FamilyShoppingLists } from './family-shopping-lists.tsx';
import { useSubscription } from '../hooks/use-subscription.ts';
import { Dropdown } from 'react-bootstrap';
import { CreateFamilyModal } from './create-family-modal.tsx';
import { FamilyCalendars } from './family-calendars.tsx';
import { FamilyRecipes } from './family-recipes.tsx';
import { FamilyMemberService } from '../api/generated/FamilyMemberService.ts';

export const FamilyManagement: React.FC = () => {
  const user = useUser();

  const [selectedFamilyId, setSelectedFamilyId] = useState<number>();

  const fetchFamilyOptions = useAsync(async () => {
    const response = await FamilyService.getFamilyOptionsForUser({
      userId: user?.id ?? 0,
    });
    if (response.hasErrors) {
      response.errors.forEach((error) => toast.error(error.errorMessage));
      return;
    }
    const data = response.data as OptionDto[];

    const [firstOption] = data;
    if (firstOption) {
      setSelectedFamilyId(() => firstOption.value);
    }

    return data;
  }, [user]);

  const fetchSelectedFamily = useAsyncRetry(async () => {
    if (!selectedFamilyId) return;

    const response = await FamilyService.getFamilyById({
      id: selectedFamilyId,
    });
    if (response.hasErrors) {
      response.errors.forEach((error) => toast.error(error.errorMessage));
      return;
    }
    return response.data;
  }, [selectedFamilyId]);

  useSubscription('family-refresh', fetchSelectedFamily.retry);

  useEffect(() => {
    if (!fetchSelectedFamily.loading) {
      fetchSelectedFamily.retry();
    }
  }, []);

  const fetchCurrentFamilyMember = useAsync(async () => {
    if (!fetchSelectedFamily.value || !user?.id) return;

    const response = await FamilyMemberService.getFamilyMember({
      familyId: fetchSelectedFamily.value.id,
      userId: user?.id ?? 0,
    });
    if (response.hasErrors) {
      response.errors.forEach((error) => toast.error(error.errorMessage));
      return;
    }
    return response.data;
  }, [fetchSelectedFamily.value, user?.id]);

  return (
    <LoadingContainer
      loading={
        fetchFamilyOptions.loading ||
        fetchSelectedFamily.loading ||
        fetchCurrentFamilyMember.loading
      }
    >
      <>
        {!fetchFamilyOptions.loading &&
        !fetchSelectedFamily.loading &&
        (fetchFamilyOptions.value?.length ?? 0 > 0) ? (
          <>
            <div className={'col-12 text-center'}>
              <Dropdown>
                <Dropdown.Toggle
                  variant={'outline-light'}
                  className={'text-center'}
                >
                  <h2 className="text-center text-highlight mb-1">
                    {fetchSelectedFamily.value?.name}
                  </h2>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {fetchFamilyOptions.value?.map((family) => (
                    <Dropdown.Item
                      key={family.value}
                      onClick={() => setSelectedFamilyId(family.value)}
                    >
                      {family.label}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className={'col-12 text-center'}>
              <CreateFamilyModal />
            </div>
            {fetchSelectedFamily.value && fetchCurrentFamilyMember.value && (
              <div className={'row'}>
                <div className={'col-lg-4 col-md-6'}>
                  <FamilyMembers
                    familyId={selectedFamilyId ?? 0}
                    memberRole={fetchCurrentFamilyMember.value.role}
                  />
                </div>
                <div className={'col-lg-4 col-md-6'}>
                  <PendingInvites
                    familyId={selectedFamilyId ?? 0}
                    memberRole={fetchCurrentFamilyMember.value.role}
                  />
                </div>
                <div className={'col-lg-4 col-md-6'}>
                  <FamilyShoppingLists
                    familyId={selectedFamilyId ?? 0}
                    memberRole={fetchCurrentFamilyMember.value.role}
                  />
                </div>
                <div className={'col-lg-4 col-md-6'}>
                  <FamilyCalendars
                    familyId={selectedFamilyId ?? 0}
                    memberRole={fetchCurrentFamilyMember.value.role}
                  />
                </div>
                <div className={'col-lg-4 col-md-6'}>
                  <FamilyRecipes
                    familyId={selectedFamilyId ?? 0}
                    memberRole={fetchCurrentFamilyMember.value.role}
                  />
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <h2 className="text-center text-highlight mb-4">
              You have not created any families.
            </h2>
            <CreateFamilyModal />
          </>
        )}
      </>
    </LoadingContainer>
  );
};
