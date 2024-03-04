import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { App } from "../pages/App";
import { HomePage } from "../pages/HomePage";
import { Quiz } from "../pages/Quiz";
import { AchievementPage } from "../pages/AchievementPage";
import { ErrorPage } from "../pages/ErrorPage";

import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";

const studentRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "/quiz/:quizId", element: <Quiz />, children: [] },
      { path: "/achievements", element: <AchievementPage />, children: [] },
    ],
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
    errorElement: <ErrorPage />,
  },
]);

export function StudentRouter() {
  return <RouterProvider router={studentRouter} />;
}
