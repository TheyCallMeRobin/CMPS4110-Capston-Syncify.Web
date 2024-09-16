import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes.tsx';

import './api/generated/config';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

const App: React.FC = () => {
    return (
        <RouterProvider router={router} />
    );
};

export default App;
