import { createBrowserRouter, RouteObject } from 'react-router-dom';
import { MainPage } from './main-page/MainPage.tsx';
import Recipes from './Routes/Recipes/recipe.tsx';
import { Reminders } from './Routes/Reminders/reminders.tsx';
import { RegisterPage } from './Routes/RegisterPage/RegisterPage.tsx';
import { LoginPage } from './Routes/LoginPage/LoginPage.tsx';
import ShoppingLists from './Routes/ShoppingLists/shopping-lists.tsx';
import { App } from './App.tsx';
import { CalendarPage } from './calendar/calendar-page.tsx';
import { FamilyManagement } from './Routes/FamilyManagement/FamilyManagement.tsx';
import {FamilyMemberManagement} from "./Routes/FamilyManagement/FamilyMemberManagement.tsx";
import ShoppingListItems from './Routes/ShoppingListItems/shopping-list-items.tsx';
import {CreateRecipe} from './Routes/Recipes/createrecipe';
import ViewRecipe from './Routes/Recipes/viewrecipe.tsx'
import EditRecipes from './Routes/Recipes/editrecipe.tsx';

export const ROUTES = {
  LoginPage: {
    path: '/login',
    element: <LoginPage />,
  },
  Calendar: {
    path: '/calendars',
    element: <CalendarPage />,
  },
  FamilyManagement: {
    path: '/family-management',
    element: <FamilyManagement />,
  },
  Recipes: {
    path: '/recipes',
    element: <Recipes />,
  },
  CreateRecipe: {
    path: '/create-recipe',
    element: <CreateRecipe />,
  },
  EditRecipe: {
    path: '/edit-recipe/:recipeId',
    element: <EditRecipes/>,
  },
  ViewRecipe: {
    path: 'view-recipe/:recipeId',
    element: <ViewRecipe/>,
  },
  FamilyMemberManagement: {
    path: 'family-member-management/:familyId',
    element: <FamilyMemberManagement/>,
  },
  CalendarPage: {
    path: '/calendars',
    element: <CalendarPage />,
  },
  Dashboard: {
    path: '/',
    element: <MainPage />,
  },
  RegisterPage: {
    path: '/register',
    element: <RegisterPage />,
  },
  Reminders: {
    path: '/reminders',
    element: <Reminders />,
  },
  ShoppingLists: {
    path: '/shopping-lists',
    element: <ShoppingLists />,
  },
  ShoppingListsItems: {
    path: '/shopping-list-items/:listId',
    element: <ShoppingListItems />,
  },
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
