import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";

import { refreshToken, getUserInfo } from "../hooks/useUser";

import "core-js/stable/atob";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState("");
  const [expiresIn, setExpiresIn] = useState("");
  const [uid, setUid] = useState("");
  const [uEmail, setUEmail] = useState("");
  const [uRole, setURole] = useState("");

  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      setUid(decodedToken.uid);
      setURole(decodedToken.role);
      setUEmail(decodedToken.email);
    }
  }, [token]);

  useEffect(() => {
    if (uid && user === null) {
      getUserInfo(uid, token)
        .then((res) => {
          setUser(res.data);
        })
        .catch((e) => console.log(e));
    }
  }, [uid]);

  const timerRef = useRef(null);

  useEffect(() => {
    // Al desmontar el componente, limpiar el temporizador
    return () => {
      clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (expiresIn > 0) {
      setTime();
    }
  }, [expiresIn]);

  const refresh = async () => {
    setExpiresIn(0);
    refreshToken("/auth/refresh")
      .then((res) => {
        setToken(res.data.token);
        setExpiresIn(res.data.expiresIn);
      })
      .catch((e) => console.log(e));
  };

  const setTime = () => {
    // Limpiar el temporizador actual
    clearTimeout(timerRef.current);

    // Configurar un nuevo temporizador
    timerRef.current = setTimeout(() => {
      refresh();
    }, expiresIn * 100 - 4000);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        uid,
        setUid,
        uRole,
        setURole,
        uEmail,
        setUEmail,
        token,
        setToken,
        expiresIn,
        setExpiresIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }

  return context;
};
