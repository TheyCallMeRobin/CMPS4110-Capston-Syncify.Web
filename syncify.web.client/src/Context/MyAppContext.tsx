import React, { createContext, useState, ReactNode } from 'react';

type MyAppContextProps = {
    user: string | null;
    setUser: (user: string | null) => void;
}

export const MyAppContext = createContext<MyAppContextProps | undefined>(undefined);

export const MyAppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<string | null>(null);

    return (
        <MyAppContext.Provider value={{ user, setUser }}>
            {children}
        </MyAppContext.Provider>
    );
};
