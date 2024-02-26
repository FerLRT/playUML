import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { TeacherPage } from "../pages/TeacherPage";
import { ErrorPage } from "../pages/ErrorPage";

import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";

const teacherRouter = createBrowserRouter([
  {
    path: "/",
    element: <TeacherPage />,
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

export function TeacherRouter() {
  return <RouterProvider router={teacherRouter} />;
}
