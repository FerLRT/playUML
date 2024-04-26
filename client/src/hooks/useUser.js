import { instance, instanceWithAuth } from "./axiosInstance";

export function login(email, password) {
  return instance
    .post("/auth/login", { email, password })
    .then((response) => response);
}

export function register(email, password, confirmPassword) {
  return instance
    .post("/auth/signup", { email, password, confirmPassword })
    .then((response) => response);
}

export async function sendFileData(data) {
  return await instance
    .post("/auth/import", data)
    .then((response) => response.data)
    .catch((error) => console.error("Error al enviar el archivo:", error));
}

export function getStudentStats(id, token) {
  const instanceToken = instanceWithAuth(token);
  return instanceToken.get(`/auth/student/${id}`).then((response) => response);
}

export function updatePassword(
  userId,
  currentPassword,
  password,
  confirmPassword,
  token
) {
  const instanceToken = instanceWithAuth(token);
  return instanceToken
    .put(`/auth/update/${userId}`, {
      currentPassword,
      password,
      confirmPassword,
    })
    .then((response) => response);
}

export async function refreshToken() {
  return await instance.get("/auth/refresh").then((response) => response);
}

export function getUserInfo(uid, token) {
  const instanceToken = instanceWithAuth(token);
  return instanceToken.get(`/auth/class/${uid}`).then((response) => response);
}
