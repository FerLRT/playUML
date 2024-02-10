import React from "react";

import logo from "../assets/logo.png";
import "../styles/Header.css";

export function Header() {
  return (
    <header className="header">
      <img src={logo} alt="PlayUML Logo" />
    </header>
  );
}
