import React from 'react';
import { MyAppContextProvider } from './Context/MyAppContext';
import './App.css';

const App: React.FC = () => {
    return (
        <MyAppContextProvider>
                <div className="App">
                    {/* Other global components can go here */}
                    <header className="App-header">
                        <h1>Welcome to Syncify</h1>
                    </header>
                    {/* The rest of your app will be managed by RouterProvider in main.tsx */}
                </div>
        </MyAppContextProvider>
    );
};

export default App;

