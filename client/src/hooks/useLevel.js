import { instance } from "./axiosInstance";

export async function getRequiredPointsForNextLevel(currentLevel) {
  return await instance
    .get(`/levels/${currentLevel}`)
    .then((response) => response.data)
    .catch((error) =>
      console.error("Error al obtener información del nivel:", error)
    );
}
