import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

import { useAuth } from "../context/AuthContext";

import logo from "../assets/logo.png";
import "../styles/header.css";

export function TeacherHeader() {
  const { user, setUser } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  const navigate = useNavigate();

  const handleClassButtonClick = () => {
    navigate("/");
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuProfileClick = () => {
    handleMenuClose();
    navigate("/profile");
  };

  const handleMenuLogoutClick = () => {
    setUser(null);
    handleMenuClose();
    navigate("/");
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <header className="header">
      <img src={logo} alt="PlayUML Logo" />
      <div className="header-profile-container">
        <div className="header-options-buttons">
          <button onClick={handleClassButtonClick}>Mis clases</button>
        </div>
        <div className="header-user-container">
          <Button
            aria-controls={anchorEl ? "basic-menu" : undefined}
            aria-haspopup="true"
            onClick={handleMenuClick}
            color="inherit"
            style={{ padding: 0 }}
          >
            <p className="header-user">{user ? `${user.email}` : ""}</p>
            <img
              className="header-avatar"
              src={`/src/assets/avatar.png`}
              alt="Avatar"
              onClick={handleMenuClick}
            />

            {anchorEl ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={handleMenuProfileClick}>Perfil</MenuItem>
            <MenuItem onClick={handleMenuLogoutClick}>Cerrar sesión</MenuItem>
          </Menu>
        </div>
      </div>
    </header>
  );
}
