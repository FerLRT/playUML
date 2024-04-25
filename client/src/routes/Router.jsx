import React from "react";
import { useAuth } from "../context/AuthContext";
import { PublicRouter } from "./routerPublic";
import { TeacherRouter } from "./routerTeacher";
import { StudentRouter } from "./routerStudent";

export function Router() {
  const { uRole } = useAuth();

  if (uRole) {
    if (uRole === "profesor") {
      return <TeacherRouter />;
    }

    if (uRole === "estudiante") {
      return <StudentRouter />;
    }
  }

  // Si el usuario no está autenticado, redirige al inicio de sesión
  return <PublicRouter />;
}
