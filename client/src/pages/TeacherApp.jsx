import { Outlet } from "react-router-dom";
import { Header } from "../components/Header.jsx";

import "../styles/app.css";

export function TeacherApp() {
  return (
    <main className="main">
      <Header />
      <Outlet />
    </main>
  );
}
