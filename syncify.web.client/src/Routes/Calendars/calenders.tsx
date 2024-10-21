import React from 'react';
import { Outlet } from 'react-router-dom';
import "./../../index.css";

export const Calendars: React.FC = () => {
    return (
        <div>
            <h2 className="text-center text-highlight mb-4">This Is The Syncify Calendars Page!</h2>
            <Outlet />
        </div>
    );
};