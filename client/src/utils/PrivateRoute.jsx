import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { App } from "../pages/App";

export const PrivateRoute = () => {
  const { user } = useAuth();

  // Verifica si el usuario aún no se ha cargado
  if (user === null) {
    return <div>Loading...</div>;
  }

  // Si el usuario ya está cargado, renderiza las rutas protegidas
  return user ? <App /> : <Navigate to="/login" replace />;
};
