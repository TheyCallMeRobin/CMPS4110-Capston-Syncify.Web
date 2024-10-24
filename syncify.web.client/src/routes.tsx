import { createBrowserRouter, RouteObject } from 'react-router-dom';
import { MainPage } from './main-page/MainPage.tsx';
import { Calendars } from './Routes/Calendars/calenders.tsx';
import { Recipes } from './Routes/Recipes/recipe.tsx';
import { Reminders } from './Routes/Reminders/reminders.tsx';
import { RegisterPage } from './Routes/RegisterPage/RegisterPage.tsx';
import { LoginPage } from './Routes/LoginPage/LoginPage.tsx';
import ShoppingLists from './Routes/ShoppingLists/shopping-lists.tsx';
import { App } from './App.tsx';

export const ROUTES = {
  LoginPage: {
    path: '/login',
    element: <LoginPage />,
  },
  Dashboard: {
    path: '/',
    element: <MainPage />,
  },
  RegisterPage: {
    path: '/register',
    element: <RegisterPage />,
  },
  Calendars: {
    path: '/calendars',
    element: <Calendars />,
  },
  Recipes: {
    path: '/recipes',
    element: <Recipes />,
  },
  Reminders: {
    path: '/reminders',
    element: <Reminders />,
  },
  ShoppingLists: {
    path: '/shopping-lists',
    element: <ShoppingLists />,
  },
  /*
  AccountSettings: {
    path: '/account-settings',
    element: <AccountSettings />,
  }, */
};

const routes: RouteObject[] = [
  {
    element: <App />,
    children: Object.values(ROUTES).map(({ path, element }) => ({
      path,
      element,
    })),
  },
];

export const router = createBrowserRouter(routes);
