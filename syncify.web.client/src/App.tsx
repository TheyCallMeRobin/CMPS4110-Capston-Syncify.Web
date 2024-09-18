import React from 'react';
import { MyAppContextProvider } from './Context/MyAppContext';
import './App.css';

export const App: React.FC = () => {
  return (
      <>
        <MyAppContextProvider>
          <div className="App">
            <header className="App-header">
              <h1>Welcome to Syncify</h1>
            </header>
          </div>
        </MyAppContextProvider>
      </>
  );
};

