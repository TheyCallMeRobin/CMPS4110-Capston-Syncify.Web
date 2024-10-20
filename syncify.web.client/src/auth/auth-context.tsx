import { createContext, FC, ReactNode, useContext, useState } from 'react';
import { UserGetDto } from '../api/generated/index.defs.ts';
import { useAsync } from 'react-use';
import { AuthenticationService } from '../api/generated/AuthenticationService.ts';

type AuthContextState = {
    user?: UserGetDto;
    clearUser: () => void;
};

const initialState: AuthContextState = {
    user: undefined,
    clearUser: () => { },
};

const AuthContext = createContext<AuthContextState>(initialState);

export const useUser = (): UserGetDto | undefined => {
    const authContext = useContext(AuthContext);

    if (!authContext)
        throw new Error("`useUser' hook must be used within an AuthContext.");

    return authContext.user;
};

export const AuthProvider: FC<{ children?: ReactNode }> = ({ children }) => {
    const [authState, setAuthState] = useState<AuthContextState>(initialState);

    const fetchUser = useAsync(async () => {
        const response = await AuthenticationService.me();
        if (response.hasErrors || !response.data) {
            return initialState;
        }
        const state: AuthContextState = {
            user: response.data,
            clearUser: () => setAuthState(initialState),
        };
        setAuthState(state);
        return state;
    }, []);

    return (
        <>
            {fetchUser.loading ? (
                <div className="d-flex justify-content-center align-content-center text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <AuthContext.Provider value={authState}>
                    {children}
                </AuthContext.Provider>
            )}
        </>
    );
};
