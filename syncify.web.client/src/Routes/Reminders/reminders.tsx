
import React from 'react';
import { Outlet } from 'react-router-dom';

export default function Reminders() {
    return (
        <div>
            This is where Reminders will go!
            <Outlet />
        </div>
    );
}
