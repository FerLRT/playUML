import { instanceWithAuth } from "./axiosInstance";

export async function getRequiredPointsForNextLevel(currentLevel, token) {
  const instanceToken = instanceWithAuth(token);
  return await instanceToken
    .get(`/levels/${currentLevel}`)
    .then((response) => response.data)
    .catch((error) =>
      console.error("Error al obtener información del nivel:", error)
    );
}
