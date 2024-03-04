import { Outlet } from "react-router-dom";

import "../styles/app.css";

export function PublicApp() {
  return (
    <main className="main">
      <h1>Public Header</h1>
      <Outlet />
    </main>
  );
}
