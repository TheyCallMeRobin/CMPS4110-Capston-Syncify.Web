import React from 'react';
import { AuthenticationService } from "./api/generated/AuthenticationService.ts";

export const MainPage: React.FC = () => {
    return (
        <div className="page-content">
            <div className="text-center">
                <h2 className="text-center text-highlight mb-4">This Is The Syncify Landing Page!</h2>
            </div>
        </div>
    );
};