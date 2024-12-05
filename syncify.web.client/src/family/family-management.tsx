import React, { useState } from 'react';
import { useAsync } from 'react-use';
import { useUser } from '../auth/auth-context.tsx';
import { FamilyService } from '../api/generated/FamilyService.ts';
import { toast } from 'react-toastify';
import { OptionDto } from '../api/generated/index.defs.ts';
import { LoadingContainer } from '../Components/loading-container.tsx';
import { FaPlus } from 'react-icons/fa';
import { FamilyMembers } from './family-members.tsx';

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

  const handleSetSelectedFamilyId = (id) => setSelectedFamilyId(() => id);

  const fetchSelectedFamily = useAsync(async () => {
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

  return (
    <LoadingContainer
      loading={fetchFamilyOptions.loading || fetchSelectedFamily.loading}
    >
      <>
        {!fetchFamilyOptions.loading &&
        !fetchSelectedFamily.loading &&
        (fetchFamilyOptions?.value?.length ?? 0 > 0) ? (
          <>
            <div className={'col-12'}>
              <h2 className="text-center text-highlight mb-1">
                {fetchSelectedFamily.value?.name}
              </h2>
            </div>
            <div className={'col-12 text-center'}>
              <CreateFamily />
            </div>
            {fetchSelectedFamily.value && (
              <div className={'row'}>
                <div className={'col-lg-4 col-md-6'}>
                  <FamilyMembers familyId={selectedFamilyId ?? 0} />
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <h2 className="text-center text-highlight mb-4">
              You have not created any families.
            </h2>
            <CreateFamily />
          </>
        )}
      </>
    </LoadingContainer>
  );
};

const CreateFamily = () => {
  return (
    <>
      <button className={'btn btn-link'}>
        <FaPlus className={'mx-1'} />
        Create a family
      </button>
    </>
  );
};
