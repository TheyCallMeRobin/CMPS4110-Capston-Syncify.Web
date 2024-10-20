
import React from 'react';

import './MainPage.css';
import { AuthenticationService } from "./api/generated/AuthenticationService.ts";

export const MainPage: React.FC = () => {
    return (
        <div>
            <div className="text-center">
                <h2 className="text-center text-highlight mb-4">This Is The Syncify Landing Page!</h2>
            </div>
        </div>
    );
};