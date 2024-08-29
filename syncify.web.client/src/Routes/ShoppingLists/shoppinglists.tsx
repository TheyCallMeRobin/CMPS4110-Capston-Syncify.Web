import React from 'react';
import { Outlet } from 'react-router-dom';

export const ShoppingLists: React.FC = () => {
    return (
        <div>
            This is where Shopping Lists will go!!
            <Outlet />
        </div>
    );
};
