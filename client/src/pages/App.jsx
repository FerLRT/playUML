import { Outlet } from "react-router-dom";
import { Header } from "../components/Header.jsx";

import "../styles/app.css";

export function App() {
  return (
    <main className="main">
      <Header />
      <Outlet />
    </main>
  );
}
