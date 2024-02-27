import { instance } from "./axiosInstance";

export async function login(email, password) {
  return await instance
    .post("/auth/login", { email, password })
    .then((response) => response.data)
    .catch((error) => console.error("Error al hacer login:", error));
}

export async function sendFileData(data) {
  return await instance
    .post("/auth/import", data)
    .then((response) => response.data)
    .catch((error) => console.error("Error al enviar el archivo:", error));
}
