import React from 'react';
import { MyAppContextProvider } from './Context/MyAppContext';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes.tsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './api/generated/config';
import './App.css';

export const App: React.FC = () => {
  return (
      <MyAppContextProvider>
        <RouterProvider router={router}/>
      </MyAppContextProvider>
  );
};