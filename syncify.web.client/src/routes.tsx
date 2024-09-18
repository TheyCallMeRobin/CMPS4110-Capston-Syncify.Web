import { createBrowserRouter, RouteObject, RouterProvider } from 'react-router-dom';
import { Authorization } from './Routes/Authorization/authorization.tsx';
import { Calendars } from './Routes/Calendars/calenders.tsx';
import React, { FC } from 'react';
import { Recipes } from './Routes/Recipes/recipe.tsx';
import { Reminders } from './Routes/Reminders/reminders.tsx';
import ShoppingLists from './Routes/ShoppingLists/shoppinglists.tsx';
import { MainPage } from './MainPage.tsx';
import { ErrorPage } from './ErrorPage/error-page.tsx';

const routes: RouteObject[] = [
  {
    path: "/",
    element: <MainPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "authorization",
    element: <Authorization />
  },
  {
    path: "calendars",
    element: <Calendars />,
  },
  {
    path: "recipes",
    element: <Recipes />,

  },
  {
    path: "reminders",
    element: <Reminders />,
  },
  {
    path: "shoppinglists",
    element: <ShoppingLists />,
  },
]

const router = createBrowserRouter(routes);

export const Router: FC = () => <RouterProvider router={router} />