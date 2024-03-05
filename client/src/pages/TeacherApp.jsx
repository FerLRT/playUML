import { Outlet } from "react-router-dom";
import { TeacherHeader } from "../components/TeacherHeader.jsx";

import "../styles/app.css";

export function TeacherApp() {
  return (
    <main className="main">
      <TeacherHeader />
      <Outlet />
    </main>
  );
}
