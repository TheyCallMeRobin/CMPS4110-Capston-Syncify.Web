import React, { CSSProperties, useState } from 'react';
import { useUser } from '../auth/auth-context.tsx';
import { useAsync } from 'react-use';
import { FamilyService } from '../api/generated/FamilyService.ts';
import { toast } from 'react-toastify';
import { Select } from '../Components/inputs/select.tsx';
import { OptionDto } from '../api/generated/index.defs.ts';
import { FamilyMemberService } from '../api/generated/FamilyMemberService.ts';
import { cardStyle } from './MainPage.tsx';
import { LoadingContainer } from '../Components/loading-container.tsx';
import { FaPeopleGroup } from 'react-icons/fa6';

export const FamilyMembers: React.FC = () => {
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

    const fetchFamilyMembers = useAsync(async () => {
        if (!selectedFamilyId) return;

        const response = await FamilyMemberService.getFamilyMembers({
            familyId: selectedFamilyId,
        });
        if (response.hasErrors) {
            response.errors.forEach((error) => toast.error(error.errorMessage));
            return;
        }

        return response.data;
    }, [selectedFamilyId]);

    const FamilyDisplay = () => {
        if (!fetchFamilyMembers.value || fetchFamilyMembers.value?.length <= 0) {
            return <>There are no members in this family.</>;
        }
        return (
            <table className={'table table-striped'}>
                <thead>
                    <tr>
                        <th>Name</th>
                    </tr>
                </thead>
                <tbody>
                    {fetchFamilyMembers.value?.map((familyMember) => {
                        return (
                            <tr key={familyMember.id}>
                                <td>{`${familyMember.userFirstName} ${familyMember.userLastName}`}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    };

    return (
        <div className={'card mb-4 shadow dashboard-card'} style={cardStyle}>
            <div className={'card-header primary-bg text-white'}>
                <div className={'hstack gap-3'}>
                    <div className={'hstack gap-2'}>
                        <div>
                            <FaPeopleGroup />
                        </div>
                        <div>Family Members</div>
                    </div>
                    <div className={'ms-auto'}>
                        <Select
                            data={fetchFamilyOptions.value}
                            style={selectStyle}
                            onSelect={handleSetSelectedFamilyId}
                        />
                    </div>
                </div>
            </div>
            <div className={'card-body'}>
                <LoadingContainer
                    loading={fetchFamilyOptions.loading || fetchFamilyMembers.loading}
                >
                    <FamilyDisplay />
                </LoadingContainer>
            </div>
        </div>
    );
};

const selectStyle: CSSProperties = {
    border: 'none',
    background: 'none',
    color: 'white',
    width: '100%',
};