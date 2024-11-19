import { createContext, FC, ReactNode, useContext, useState } from 'react';
import { UserGetDto } from '../api/generated/index.defs.ts';
import { useAsyncFn } from 'react-use';
import { AuthenticationService } from '../api/generated/AuthenticationService.ts';
import { useSubscription } from '../hooks/use-subscription.ts';

type AuthContextState = {
  user?: UserGetDto | undefined;
  clearUser: () => void | undefined;
  loading?: boolean;
};

const initialState: AuthContextState = {
  user: undefined,
  clearUser: () => undefined,
  loading: false,
};

export const AuthContext = createContext<AuthContextState>(initialState);

export const useUser = (): UserGetDto | undefined => {
  const authContext = useContext(AuthContext);

  if (!authContext)
    throw new Error("`useUser' hook must be used within an AuthContext.");

  return authContext.user;
};

export const AuthProvider: FC<{ children?: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthContextState>(initialState);

  const [fetchState, fetchUser] = useAsyncFn(async () => {
    const response = await AuthenticationService.me();
    if (response.hasErrors) {
      return initialState;
    }

    const state: AuthContextState = {
      user: response.data!,
      clearUser: () => setAuthState(initialState),
      loading: false,
    };

    setAuthState(() => state);
  }, []);

  useSubscription('auth-trigger', fetchUser);

  return (
    <>
      {fetchState.loading || authState.loading ? (
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
