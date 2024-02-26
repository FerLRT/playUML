import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { ErrorPage } from "../pages/ErrorPage.jsx";
import { LoginPage } from "../pages/LoginPage.jsx";
import { RegisterPage } from "../pages/RegisterPage.jsx";

import { PublicApp } from "../pages/PublicApp.jsx";

export const publicRouter = createBrowserRouter([
  {
    path: "/",
    element: <PublicApp />,
    children: [
      { path: "/", element: <LoginPage />, children: [] },
      { path: "/register", element: <RegisterPage />, children: [] },
    ],
    errorElement: <ErrorPage />,
  },
]);

export function PublicRouter() {
  return <RouterProvider router={publicRouter} />;
}
