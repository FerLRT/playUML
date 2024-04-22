import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { updatePassword } from "../hooks/useUser";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

import "../styles/userConfigPage.css";

export function UserConfigPage() {
  const { user } = useAuth();

  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChangePassword = async () => {
    await updatePassword(user.id, password, newPassword, confirmPassword)
      .then((response) => {
        setSuccess("Contraseña cambiada con éxito");
        setError("");
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.errors
        ) {
          const errorMessage = error.response.data.errors
            .map((error) => error.msg)
            .join(". ");
          setError(errorMessage);
        } else if (error.response && error.response.data) {
          setError(error.response.data);
          setSuccess("");
        } else {
          setError("Error al cambiar la contraseña");
          setSuccess("");
        }
      });
  };

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <div className="user-config-page">
      <h1 className="user-config-page-title">Actualizar contraseña</h1>
      <div className="user-config-page-info">
        <Stack sx={{ width: "100%", marginBottom: "10px" }} spacing={2}>
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}
        </Stack>
        <label htmlFor="password">Contraseña actual:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label htmlFor="newPassword">Nueva contraseña:</label>
        <input
          type="password"
          id="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <label htmlFor="confirmPassword">Confirmar contraseña:</label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <div className="button-confirm-password-container">
          <button
            className="button-confirm-password"
            onClick={handleChangePassword}
          >
            Cambiar contraseña
          </button>
        </div>
      </div>

      <button className="button-basic" onClick={handleGoBack}>
        Volver
      </button>
    </div>
  );
}
