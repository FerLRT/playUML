import { instance } from "./axiosInstance";

export async function login(email, password) {
  return await instance
    .post("/auth/login", { email, password })
    .then((response) => response.data)
    .catch((error) => console.error("Error al hacer login:", error));
}
