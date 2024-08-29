import React from 'react';
import { Outlet } from 'react-router-dom';

export const Reminders: React.FC = () => {
    return (
        <div>
            This is where Reminders will go!
            <Outlet />
        </div>
    );
};
