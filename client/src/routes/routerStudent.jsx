import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { App } from "../pages/App";
import { HomePage } from "../pages/HomePage";
import { Quiz } from "../pages/Quiz";
import { AchievementPage } from "../pages/AchievementPage";
import { UserConfigPage } from "../pages/UserConfigPage";
import { ErrorPage } from "../pages/ErrorPage";

const studentRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "/profile", element: <UserConfigPage /> },
      { path: "/quiz/:quizId", element: <Quiz />, children: [] },
      { path: "/achievements", element: <AchievementPage />, children: [] },
    ],
    errorElement: <ErrorPage />,
  },
]);

export function StudentRouter() {
  return <RouterProvider router={studentRouter} />;
}
