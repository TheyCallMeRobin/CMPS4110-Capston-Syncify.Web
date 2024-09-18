import React from 'react';
import { MyAppContextProvider } from './Context/MyAppContext';
import './App.css';
import { Router } from './routes.tsx';

export const App: React.FC = () => {
  return (
      <>
        <MyAppContextProvider>
          <Router />
        </MyAppContextProvider>
      </>
  );
};

