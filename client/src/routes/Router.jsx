import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { App } from "../pages/App.jsx";
import { HomePage } from "../pages/HomePage.jsx";
import { ErrorPage } from "../pages/ErrorPage.jsx";

import { Quiz } from "../pages/Quiz.jsx";
import { CodeViewer } from "../components/CodeViewer.jsx";

const codeExample = "for (let i = 0; i < 10; i++) {\\n  console.log(i);\\n}";

export function Router() {
  const router = createBrowserRouter([
    {
      path: "/pruebas",
      element: <CodeViewer code={codeExample} />,
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
