import React from 'react';
import { Outlet } from 'react-router-dom';

export const Calendars: React.FC = () => {
    return (
        <div>
            This is where Calendars will go!
            <Outlet />
        </div>
    );
};
