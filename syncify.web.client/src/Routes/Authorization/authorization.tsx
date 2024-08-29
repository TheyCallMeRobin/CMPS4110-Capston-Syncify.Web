import React from 'react';
import { Outlet } from 'react-router-dom';

export const Authorization: React.FC = () => {
    return (
        <div>
            This is where Authorization will go!
            <Outlet />
        </div>
    );
};
