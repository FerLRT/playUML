import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { App } from "../pages/App.jsx";
import { HomePage } from "../pages/HomePage.jsx";
import { ErrorPage } from "../pages/ErrorPage.jsx";

import { DiagramImage } from "../components/DiagramImage.jsx";
import { CustomRadioButton } from "../components/CustomRadioButton.jsx";
import { QuestionType1 } from "../components/QuestionType1.jsx";
import { QuestionType2 } from "../components/QuestionType2.jsx";
import { Quiz } from "../pages/Quiz.jsx";

export function Router() {
  const router = createBrowserRouter([
    {
      path: "/pruebas",
      element: <QuestionType1 />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/", // path: "/student" --- path: "/quizzes",
      element: <App />,
      children: [
        { index: true, element: <HomePage /> },
        { path: "/quiz/:quizId", element: <Quiz />, children: [] },
      ],
      errorElement: <ErrorPage />,
    },
  ]);

  return <RouterProvider router={router} />;
}
