import { instance } from "./axiosInstance";

export async function getTeacherClasses(email) {
  return await instance
    .get(`/classes/${email}`)
    .then((response) => response.data)
    .catch((error) => console.error("Error al obtener clases:", error));
}
