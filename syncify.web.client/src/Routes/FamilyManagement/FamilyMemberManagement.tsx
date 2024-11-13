import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export const FamilyMemberManagement = () => {
    const { familyId } = useParams<{ familyId: string }>();
    const [familyName, setFamilyName] = useState<string>('');

    //This is temporary placeholder until my next PR
    useEffect(() => {
        if (familyId) {
            const fetchedFamilyName = "Family Members:"; 
            setFamilyName(fetchedFamilyName);
        }
    }, [familyId]);

    return (
        <div className="text-center">
            <h2 className="text-highlight mb-4">{familyName}</h2>
        </div>
    );
};