import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { TeacherApp } from "../pages/TeacherApp";
import { TeacherPage } from "../pages/TeacherPage";
import { ClassPage } from "../pages/ClassPage";
import { QuizReviewPage } from "../pages/QuizReviewPage";
import { StudentStatsPage } from "../pages/StudentStatsPage";
import { UserConfigPage } from "../pages/UserConfigPage";
import { ErrorPage } from "../pages/ErrorPage";

const teacherRouter = createBrowserRouter([
  {
    path: "/",
    element: <TeacherApp />,
    children: [
      { index: true, element: <TeacherPage /> },
      { path: "/profile", element: <UserConfigPage /> },
      { path: "/class/:classId", element: <ClassPage />, children: [] },
      {
        path: "/class/:classId/quiz/:quizId",
        element: <QuizReviewPage />,
        children: [],
      },
      {
        path: "/class/:classId/student/:studentId",
        element: <StudentStatsPage />,
        children: [],
      },
      {
        path: "/class/:classId/student/:studentId/quiz/:quizId",
        element: <QuizReviewPage />,
        children: [],
      },
    ],
    errorElement: <ErrorPage />,
  },
]);

export function TeacherRouter() {
  return <RouterProvider router={teacherRouter} />;
}
