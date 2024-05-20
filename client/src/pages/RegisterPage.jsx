import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../hooks/useUser";
import { useAuth } from "../context/AuthContext";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

import "../styles/login.css";

export function RegisterPage() {
  const { setToken, setExpiresIn, setRefreshTokenJWT } = useAuth();

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setLoading(true);
    await register(email, password, confirmPassword)
      .then((response) => {
        setToken(response.data.token);
        setExpiresIn(0);
        setExpiresIn(response.data.expiresIn);
        setRefreshTokenJWT(response.data.refreshToken);
        navigate("/");
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
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="login-page">
      <div className="login-page-container">
        <h1 className="login-title">PlayUML</h1>
        <div className="login-form">
          <h2 className="login-title-2">Crea una cuenta</h2>

          <label className="login-label">Correo electrónico</label>
          <input
            className="login-input"
            type="email"
            placeholder="Ingrese email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="login-label">Contraseña</label>
          <input
            className="login-input"
            type="password"
            placeholder="Ingrese contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label className="login-label">Confirmar contraseña</label>
          <input
            className="login-input"
            type="password"
            placeholder="Confirme contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <div className="login-button">
            {loading ? (
              <div className="loader"></div>
            ) : (
              <button
                className="button-basic"
                type="button"
                onClick={handleRegister}
              >
                Registrarse
              </button>
            )}
          </div>
          <Stack sx={{ width: "100%" }} spacing={2}>
            {error && <Alert severity="error">{error}</Alert>}
          </Stack>
          <div>
            ¿Ya tienes una cuenta? <Link to="/">Iniciar sesión aquí</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
