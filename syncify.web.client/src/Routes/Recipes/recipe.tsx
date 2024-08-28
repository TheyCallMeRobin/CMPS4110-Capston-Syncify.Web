
import React from 'react';
import { Outlet } from 'react-router-dom';

export default function Recipes() {
    return (
        <div>
            This is where Recipes will go!
            <Outlet />
        </div>
    );
}
