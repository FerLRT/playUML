import React from "react";

import logo from "../assets/logo.png";
import "../styles/header.css";

export function PublicHeader() {
  return (
    <header className="header">
      <img src={logo} alt="PlayUML Logo" />
    </header>
  );
}
