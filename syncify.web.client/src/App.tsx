import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './api/generated/config';
import './App.css';
import { useUser } from './auth/auth-context.tsx';
import { Outlet, useNavigate } from 'react-router-dom';
import { ROUTES } from './routes.tsx';

export const App: React.FC = () => {
  const user = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate(ROUTES.LoginPage.path);
    }
  }, [navigate, user]);

  return (
    <>
      <Outlet />
    </>
  );
};
