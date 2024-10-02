import React, { createContext, useState, ReactNode } from 'react';


type User = {
    id: string;
    email: string;
};

type MyAppContextProps = {
    user: User | null;
    setUser: (user: User | null) => void;
}

export const MyAppContext = createContext<MyAppContextProps | undefined>(undefined);

export const MyAppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    return (
        <MyAppContext.Provider value={{ user, setUser }}>
            {children}
        </MyAppContext.Provider>
    );
};
