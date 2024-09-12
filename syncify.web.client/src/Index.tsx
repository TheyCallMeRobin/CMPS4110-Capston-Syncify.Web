import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './index.css'
import ErrorPage from "./ErrorPage/error-page.tsx";
import { Authorization } from './Routes/Authorization/authorization.tsx';
import { Recipes } from './Routes/Recipes/recipe.tsx';
import { Reminders } from './Routes/Reminders/reminders.tsx';
import { ShoppingLists } from './Routes/ShoppingLists/shoppinglists.tsx';
import { Calendars } from './Routes/Calendars/calenders.tsx';
import { MainPage } from './MainPage';

const router = createBrowserRouter([

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
                path: "/shopping-list",
                element: <ShoppingLists />,
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(

    <RouterProvider router={router} />
)
