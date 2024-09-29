import { createBrowserRouter, RouteObject } from 'react-router-dom';
import { MainPage } from './MainPage.tsx';
import { Authorization } from './Routes/Authorization/authorization.tsx';
import { Calendars } from './Routes/Calendars/calenders.tsx';
import { Recipes } from './Routes/Recipes/recipe.tsx';
import { Reminders } from './Routes/Reminders/reminders.tsx';
import { ErrorPage } from './ErrorPage/error-page.tsx';
import { RegisterPage } from './Routes/RegisterPage/RegisterPage.tsx';
import { LoginPage } from './Routes/LoginPage/LoginPage.tsx';
import ShoppingLists from './Routes/ShoppingLists/shopping-lists.tsx';

const routes: RouteObject[] = [
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <MainPage />,

    errorElement: <ErrorPage />,

    children: [
      {
        path: '/authorization',
        element: <Authorization />,
      },
      {
        path: '/calendars',
        element: <Calendars />,
      },
      {
        path: '/recipes',
        element: <Recipes />,
      },
      {
        path: '/reminders',
        element: <Reminders />,
      },
      {
        path: '/shoppinglists',
        element: <ShoppingLists />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
