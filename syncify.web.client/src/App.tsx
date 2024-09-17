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


/*
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {MainPage} from './MainPage.tsx';

import './api/generated/config';


import './App.css';
import ShoppingLists from './Routes/ShoppingLists/shoppinglists.tsx';

const App: React.FC = () => {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/shopping-list" element={<ShoppingLists /> } />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
*/