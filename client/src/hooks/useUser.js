import { instance } from "./axiosInstance";

export function login(email, password) {
  return instance
    .post("/auth/login", { email, password })
    .then((response) => response.data)
    .catch((error) => console.error("Error al hacer login:", error));
}
