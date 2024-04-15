import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../hooks/useUser";
import { useAuth } from "../context/AuthContext";

import "../styles/login.css";

export function RegisterPage() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    try {
      const user = await register(email, password, confirmPassword);

      if (user.error) {
        setError(user.error);
        return;
      }

      setUser(user);
      navigate("/");
    } catch (error) {
      setError("Correo electrónico o contraseña incorrectos");
    }
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
            <button
              className="button-basic"
              type="button"
              onClick={handleRegister}
            >
              Registrarse
            </button>
          </div>
          {error && <div className="error">{error}</div>}
          <div>
            ¿Ya tienes una cuenta? <Link to="/">Iniciar sesión aquí</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
