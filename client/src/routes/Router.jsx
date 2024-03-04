import React from "react";
import { useAuth } from "../context/AuthContext";
import { PublicRouter } from "./routerPublic";
import { TeacherRouter } from "./routerTeacher";
import { StudentRouter } from "./routerStudent";

export function Router() {
  const { user } = useAuth();

  if (user === null) {
    return <div>Loading...</div>;
  }

  if (user) {
    if (user.role === "profesor") {
      return <TeacherRouter />;
    }

    if (user.role === "estudiante") {
      return <StudentRouter />;
    }
  }

  // Si el usuario no está autenticado, redirige al inicio de sesión
  return <PublicRouter />;
}
