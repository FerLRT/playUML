import { instance } from "./axiosInstance";

export async function login(email, password) {
  return await instance
    .post("/auth/login", { email, password })
    .then((response) => response);
}

export async function register(email, password, confirmPassword) {
  return await instance
    .post("/auth/signup", { email, password, confirmPassword })
    .then((response) => response.data)
    .catch((error) => console.error("Error al hacer registro:", error));
}

export async function sendFileData(data) {
  return await instance
    .post("/auth/import", data)
    .then((response) => response.data)
    .catch((error) => console.error("Error al enviar el archivo:", error));
}

export async function getStudentStats(id) {
  return await instance
    .get(`/auth/student/${id}`)
    .then((response) => response.data)
    .catch((error) =>
      console.error("Error al obtener las estadísticas del estudiante:", error)
    );
}
