import React from 'react';
import { Outlet } from 'react-router-dom';
import "./../../index.css";

export const Reminders: React.FC = () => {
    return (
        <div className="page-content">
            <h2 className="text-center text-highlight mb-4">This Is The Syncify Reminders Page!</h2>
            <Outlet />
        </div>
    );
};