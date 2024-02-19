import { instance } from "./axiosInstance";

export async function getUserAchievements(userEmail) {
  return await instance
    .get(`/achievements/${userEmail}`)
    .then((response) => response.data)
    .catch((error) =>
      console.error("Error al obtener información de los logros:", error)
    );
}
