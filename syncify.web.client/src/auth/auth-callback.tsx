import { useUser } from './auth-context.tsx';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '../routes.tsx';
import React from 'react';

export const AuthCallback: React.FC = () => {
  const user = useUser();
  const route = user ? ROUTES.Dashboard.path : ROUTES.LoginPage.path;

  return <Navigate to={route} />;
};
