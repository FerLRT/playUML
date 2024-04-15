import React from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import logo from "../assets/logo.png";
import "../styles/header.css";

export function Header() {
  const { user } = useAuth();

  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/achievements");
  };

  return (
    <header className="header">
      <img src={logo} alt="PlayUML Logo" />
      <div className="header-profile-container">
        <div className="header-options-buttons">
          <button onClick={handleButtonClick}>Logros</button>
        </div>
        <div className="header-user-container">
          <p className="header-user">{user ? `${user.email}` : ""}</p>
          <img
            className="header-avatar"
            src={`/src/assets/avatar.png`}
            alt="Avatar"
          />
        </div>
      </div>
    </header>
  );
}
