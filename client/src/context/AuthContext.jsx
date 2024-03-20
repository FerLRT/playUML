import React, { createContext, useContext, useEffect, useState } from "react";
import { login } from "../hooks/useUser";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await login("profesor@test.com", "profesor");
        setUser(user);
      } catch (error) {
        console.error("Error al obtener el usuario por defecto:", error);
      } finally {
        // Marcar la carga como completada, independientemente del resultado
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};
