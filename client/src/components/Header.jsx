import React from "react";

import { useAuth } from "../context/AuthContext";

import logo from "../assets/logo.png";
import "../styles/Header.css";

export function Header() {
  const { user } = useAuth();

  return (
    <header className="header">
      <img src={logo} alt="PlayUML Logo" />
      <div className="header-profile-container">
        <p className="header-user">{user ? `${user.email}` : ""}</p>
        <img
          className="header-avatar"
          src={`/src/assets/avatar.png`}
          alt="Avatar"
        />
      </div>
    </header>
  );
}
