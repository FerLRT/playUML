import React from "react";
import { PublicHeader } from "../components/PublicHeader";
import { Outlet } from "react-router-dom";

import "../styles/app.css";

export function PublicApp() {
  return (
    <main className="main">
      <PublicHeader />
      <Outlet />
    </main>
  );
}
