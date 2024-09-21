import { createBrowserRouter, RouteObject } from "react-router-dom";
import { MainPage } from './MainPage.tsx';
import { Authorization } from './Routes/Authorization/authorization.tsx';
import { Calendars } from './Routes/Calendars/calenders.tsx';
import { Recipes } from './Routes/Recipes/recipe.tsx';
import { Reminders } from './Routes/Reminders/reminders.tsx';
import { RegisterPage } from "./RegisterPage.tsx";
import { LoginPage } from "./LoginPage.tsx";
import { ErrorPage } from './ErrorPage/error-page.tsx';
import ShoppingLists from './Routes/ShoppingLists/shoppinglists.tsx';
import './index.css'

const routes : RouteObject[] = [
    {
        path: "/",
        element: <MainPage />,

        errorElement: <ErrorPage />,

        children: [

            {
                path: "/authorization",
                element: <Authorization />,
            },
            {
                path: "/register",
                element: <RegisterPage />,
            },
            {
                path: "/login",
                element: <LoginPage />,
            },
            {
                path: "/calendars",
                element: <Calendars />,
            },
            {
                path: "/recipes",
                element: <Recipes />,

            },
            {
                path: "/reminders",
                element: <Reminders />,
            },
            {
                path: "/shoppinglists",
                element: <ShoppingLists />,
            },
        ],
    },
]

export const router = createBrowserRouter(routes);
